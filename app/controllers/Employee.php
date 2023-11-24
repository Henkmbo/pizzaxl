<?php
Class Employee extends Controller
{

  private $EmployeeModel;
  private $screenModel;

  public function __construct()
  {
    $this->EmployeeModel = $this->model('EmployeeModel');
    $this->screenModel = $this->model('screenModel');
  }


  public function overview($page = 1){
    
    $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
    $perPage = 1; // Adjust this value based on your needs
    $employees = $this->EmployeeModel->getEmployees($page, $perPage);
    $totalCustomers = $this->EmployeeModel->getTotalActiveEmployees(); // Add a method to get the total count
    $data = [
          'title' => 'employees',
          'employees' => $employees,
          'activeEmployee' => $totalCustomers,
          'currentPage' => $page,
        'perPage' => $perPage,

      ];
      $this->view('employees/overview', $data);
  }

  public function create()
  {
      if ($_SERVER['REQUEST_METHOD'] == 'POST') {
          $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
          $this->EmployeeModel->create($post);
          $toast = urlencode('true');
          $toasttitle = urlencode('Succes');
          $toastmessage = urlencode('Your create of the employee was successfull');
          header('Location:' . URLROOT . 'Employee/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
      } else {
          $data = [
              'title' => 'Create employee'
          ];
          $this->view('employees/create', $data);
      }
  }

  public function update($employeeId = null, $screenId = NULL)
  {
      if ($_SERVER['REQUEST_METHOD'] == 'POST') {
          // Process the form submission
          $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
          $result = $this->EmployeeModel->update($post);
  
          if ($result) {
              // Form submission was successful
              $toast = urlencode('true');
              $toasttitle = urlencode('Success');
              $toastmessage = urlencode('Your update of the Employee was successful');
          } else {
              // Form submission failed
              $toast = urlencode('false');
              $toasttitle = urlencode('Failed');
              $toastmessage = urlencode('Your update of the Employee has failed');
          }
  
          // Redirect with feedback parameters
          header('Location:' . URLROOT . 'Employee/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
          exit;
      } else {
        // Display the form
        $employee = $this->EmployeeModel->getSingleEemployee($employeeId);
        $image = $this->screenModel->getScreenDataById($employeeId, 'employee', 'main');
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
                'title' => '<h3>Update employee</h3>',
                'employee' => $employee,
                'imageSrc' => $imageSrc,
                'image' => $image
            ];

            $this->view('employees/update', $data);
    }
}

public function updateImage($employeeId)
{
    $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    global $var;
    $screenId = $var['rand'];
    
    // Ensure that the imageUploader function returns an array
    $imageUploaderResult = $this->imageUploader($screenId);
    
    if (is_array($imageUploaderResult) && isset($imageUploaderResult['status'])) {
        if ($imageUploaderResult['status'] === 200 && strpos($imageUploaderResult['message'], 'Image uploaded successfully') !== false) {
            $entity = 'employee';
            $this->screenModel->insertScreenImages($screenId, $employeeId, $entity, $post);
            header('Location:' . URLROOT . 'Employee/update/' . $employeeId . '/{toast:true;toasttitle:Success;toastmessage:Your+create+of+the+Employee+was+successful}');
        } else {
            Helper::log('error', $imageUploaderResult);
            header('Location:' . URLROOT . 'Employee/update/' . $employeeId . '/{toast:true;toasttitle:Error;toastmessage:Employee+upload+failed}');
        }
    } else {
        // Handle the case where $imageUploaderResult is not an array
        Helper::log('error', 'Invalid response from imageUploader function');
        header('Location:' . URLROOT . 'Employee/update/' . $employeeId . '/{toast:true;toasttitle:Error;toastmessage:Image+upload+failed}');
    }
}



    public function deleteImage($ids)
    {
        $ids = explode("+", $ids);
        if ($this->screenModel->deleteScreen($ids[0])) {
            header('Location:' . URLROOT . 'Employee/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+employee+profile+was+successful}');

        } else {
            header('Location:' . URLROOT . 'Employee/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+employee+profile+has+failed}');

        }
    }

public function delete($employeeId) {
  if ($this->EmployeeModel->delete($employeeId)) {
    $toast = urlencode('true');
    $toasttitle = urlencode('Succes');
    $toastmessage = urlencode('Your delete of the Employee was successfull');
    header('Location:' . URLROOT . 'Employee/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);  } else {
        $toast = urlencode('true');
        $toasttitle = urlencode('Succes');
        $toastmessage = urlencode('Your delete of the Employee was successfull');
        header('Location:' . URLROOT . 'Employee/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);  }
}
}