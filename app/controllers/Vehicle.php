<?php
Class Vehicle extends Controller
{

  private $VehicleModel;
  private $StoreModel;
  private $ScreenModel;

  public function __construct()
  {
    $this->VehicleModel = $this->model('VehicleModel');
    $this->StoreModel = $this->model('StoreModel');
    $this->ScreenModel = $this->model('ScreenModel');
  }


  public function overview($page = 1) {
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $perPage = 1; 
    $vehicles = $this->VehicleModel->getVehicles($page, $perPage);
    $totalVehicles = $this->VehicleModel->getTotalActiveVehicles(); 
    Helper::log('error', 'dit is faya');
    $data = [
          'title' => 'vehicles', 
          'vehicles' => $vehicles,
          'totalVehicles' => $totalVehicles,
          'currentPage' => $page,
          'perPage' => $perPage,

      ];
      $this->view('vehicles/overview', $data);
  }


  public function update($vehicleId = null)
  {
      if ($_SERVER['REQUEST_METHOD'] === 'POST')
      {
          $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
          $result = $this->VehicleModel->update($post);
          if (!$result) {
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your update of the vehicle was successfull');
            header('Location:' . URLROOT . 'Vehicle/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);       
         }  else {
            $toast = urlencode('false');
            $toasttitle = urlencode('failed');
            $toastmessage = urlencode('Your update of the vehicle has failed');
            header('Location:' . URLROOT . 'Vehicle/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
            exit; 
        }

        
      } else{
          $vehicle = $this->VehicleModel->getSingleVehicle($vehicleId);
          $StoreName = $this->StoreModel->getStoreById($vehicle->vehicleStoreId);
        //   var_dump($vehicle->vehicleStoreId);exit;
          $store = $this->StoreModel->getStores();
          global $vehicleType;
          $image = $this->ScreenModel->getScreenDataById($vehicleId, 'vehicle', 'main');
          if ($image !== false) {
              // Check if the necessary properties exist before accessing them
              if (property_exists($image, 'screenCreateDate') && property_exists($image, 'screenId')) {
                  $createDate = date('Ymd', $image->screenCreateDate);
                  $imageSrc = URLROOT . 'public/media/' . $createDate . '/' . $image->screenId . '.jpg';
              } else {
                  // Handle the case where expected properties are missing
                  $imageSrc = URLROOT . 'public/default-image.jpg';
              }
          } else {
              // Handle the case where no image data is found
              $imageSrc = URLROOT . 'public/default-image.jpg';
          }
        //   var_dump($store);exit;
          $data = [
              'title' => '<h3>Update Vehicle</h3>',
              'vehicle' => $vehicle,
              'StoreName' => $StoreName,
              'store' => $store,
              'vehicleType' => $vehicleType,
              'image' => $image,
              'imageSrc' => $imageSrc
          ];
          $this->view('vehicles/update', $data);
      }
  }
  
  public function updateImage($vehicleId)
  {
      $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
      global $var;
      $screenId = $var['rand'];
      
      // Ensure that the imageUploader function returns an array
      $imageUploaderResult = $this->imageUploader($screenId);
      
      if (is_array($imageUploaderResult) && isset($imageUploaderResult['status'])) {
          if ($imageUploaderResult['status'] === 200 && strpos($imageUploaderResult['message'], 'Image uploaded successfully') !== false) {
              $entity = 'vehicle';
              $this->ScreenModel->insertScreenImages($screenId, $vehicleId, $entity, $post);
              header('Location:' . URLROOT . 'Vehicle/update/' . $vehicleId . '/{toast:true;toasttitle:Success;toastmessage:Your+create+of+the+Vehicle+was+successful}');
          } else {
              Helper::log('error', $imageUploaderResult);
              header('Location:' . URLROOT . 'Vehicle/update/' . $vehicleId . '/{toast:true;toasttitle:Error;toastmessage:Vehicle+upload+failed}');
          }
      } else {
          // Handle the case where $imageUploaderResult is not an array
          Helper::log('error', 'Invalid response from imageUploader function');
          header('Location:' . URLROOT . 'Vehicle/update/' . $vehicleId . '/{toast:true;toasttitle:Error;toastmessage:Image+upload+failed}');
      }
  }
  
  
      public function deleteImage($ids)
      {
          $ids = explode("+", $ids);
          if ($this->ScreenModel->deleteScreen($ids[0])) {
              header('Location:' . URLROOT . 'Vehicle/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Vehicle+was+successful}');
  
          } else {
              header('Location:' . URLROOT . 'Vehicle/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Vehicle+has+failed}');
  
          }
      }

  public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $this->VehicleModel->create($post);
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your create of the vehicle was successfull');
            header('Location:' . URLROOT . 'Vehicle/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
    } else {
            $store = $this->StoreModel->getStores();
            $data = [
                'title' => 'Create vehicle',
                'store' => $store
            ];
            $this->view('vehicles/create', $data);
        }
    }
  public function delete($vehicleId) {
        if ($this->VehicleModel->delete($vehicleId)) {
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your delete of the vehicle was successfull');
            header('Location:' . URLROOT . 'Vehicle/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
    } else {
        $toast = urlencode('true');
        $toasttitle = urlencode('Succes');
        $toastmessage = urlencode('Your delete of the Customer was successfull');
        header('Location:' . URLROOT . 'Vehicle/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
}
      }
}



