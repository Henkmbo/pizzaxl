<?php
Class Store extends Controller
{

  private $StoreModel;
  private $EmployeeModel;
  private $ScreenModel;

  public function __construct()
  {
    $this->StoreModel = $this->model('StoreModel');
    $this->EmployeeModel = $this->model('EmployeeModel');
    $this->ScreenModel = $this->model('ScreenModel');
  }


  public function overview($page = 1) {
    
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $perPage = 1; 
    $stores = $this->StoreModel->getStores($page, $perPage);
    $totalStores = $this->StoreModel->getTotalActiveStores(); 
    $data = [
          'title' => 'stores',
          'stores' => $stores,
          'totalStores' => $totalStores,
          'currentPage' => $page,
          'perPage' => $perPage,

      ];
      $this->view('stores/overview', $data);
  }

  public function employees($storeId) {
    
    $Employees = $this->StoreModel->getEmployeeByStore($storeId);
    $activeEmployeesCount = count($this->StoreModel->getEmployeeByStore($storeId));
    $data = [
          'title' => 'stores',
          'Employees' => $Employees,
          'activeEmployees' => $activeEmployeesCount,

      ];
      $this->view('stores/Employees', $data);
  }
  public function vehicles($storeId) {
    
    $vehicles = $this->StoreModel->getVehicleByStore($storeId);
    $activevehicles = count($this->StoreModel->getVehicleByStore($storeId));
    $data = [
          'title' => 'stores',
          'vehicles' => $vehicles,
          'activevehicles' => $activevehicles,

      ];
      $this->view('stores/vehicles', $data);
  }
  public function create()
  {
      if ($_SERVER['REQUEST_METHOD'] == 'POST') {
          $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
          $this->StoreModel->create($post);
          $toast = urlencode('true');
          $toasttitle = urlencode('Succes');
          $toastmessage = urlencode('Your create of the Store was successfull');
          header('Location:' . URLROOT . 'Store/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
} else {
        $Managers = $this->EmployeeModel->getManagers();
          $data = [
              'title' => 'Create stores',
              'Managers' => $Managers
          ];
          $this->view('stores/create', $data);
      }
  }

  public function update($storeId = null)
  {
      if ($_SERVER['REQUEST_METHOD'] === 'POST')
      {
          $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
          $result = $this->StoreModel->update($post);
          if (!$result) {
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your update of the Store was successfull');
            header('Location:' . URLROOT . 'Store/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);       
         }  else {
            $toast = urlencode('false');
            $toasttitle = urlencode('failed');
            $toastmessage = urlencode('Your update of the Store has failed');
            header('Location:' . URLROOT . 'Store/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
            exit; 
        }

      } else{
          $store = $this->StoreModel->getSingleStore($storeId);
          $image = $this->ScreenModel->getScreenDataById($storeId, 'store', 'main');
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
          $data = [
              'title' => '<h3>Update stores</h3>',
              'store' => $store,
              'imageSrc' => $imageSrc,
              'image' => $image
          ];
          $this->view('stores/update', $data);
      }
  }
  public function updateImage($storeId)
  {
      $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
      global $var;
      $screenId = $var['rand'];
      
      // Ensure that the imageUploader function returns an array
      $imageUploaderResult = $this->imageUploader($screenId);
      
      if (is_array($imageUploaderResult) && isset($imageUploaderResult['status'])) {
          if ($imageUploaderResult['status'] === 200 && strpos($imageUploaderResult['message'], 'Image uploaded successfully') !== false) {
              $entity = 'store';
              $this->ScreenModel->insertScreenImages($screenId, $storeId, $entity, $post);
              header('Location:' . URLROOT . 'Store/update/' . $storeId . '/{toast:true;toasttitle:Success;toastmessage:Your+create+of+the+Store+was+successful}');
          } else {
              Helper::log('error', $imageUploaderResult);
              header('Location:' . URLROOT . 'Store/update/' . $storeId . '/{toast:true;toasttitle:Error;toastmessage:Store+upload+failed}');
          }
      } else {
          // Handle the case where $imageUploaderResult is not an array
          Helper::log('error', 'Invalid response from imageUploader function');
          header('Location:' . URLROOT . 'Store/update/' . $storeId . '/{toast:true;toasttitle:Error;toastmessage:Image+upload+failed}');
      }
  }
  
  
      public function deleteImage($ids)
      {
          $ids = explode("+", $ids);
          if ($this->ScreenModel->deleteScreen($ids[0])) {
              header('Location:' . URLROOT . 'Store/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Store+was+successful}');
  
          } else {
              header('Location:' . URLROOT . 'Store/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Store+has+failed}');
  
          }
      }


public function delete($storeId) {
  if ($this->StoreModel->delete($storeId)) {
    $toast = urlencode('true');
    $toasttitle = urlencode('Succes');
    $toastmessage = urlencode('Your delete of the Store was successfull');
    header('Location:' . URLROOT . 'Store/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
} else {
    $toast = urlencode('true');
    $toasttitle = urlencode('Succes');
    $toastmessage = urlencode('Your delete of the Store was successfull');
    header('Location:' . URLROOT . 'Store/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
}
}
}