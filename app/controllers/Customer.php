<?php

class Customer extends Controller
{
    private $CustomerModel;
    private $screenModel;



    public function __construct()
    {
        $this->CustomerModel = $this->model('CustomerModel');
        $this->screenModel = $this->model('ScreenModel');
    }

    public function overview($params)
    {
        // Helper::dump($page);exit;
        // Extract page number from $params
        $pageNumber = isset($params['page']) ? intval($params['page']) : 1;

        // Define records per page and calculate offset
        $recordsPerPage = 2; // You can adjust this based on your needs
        $offset = ($pageNumber - 1) * $recordsPerPage;

        $customers = $this->CustomerModel->getCustomersByPagination($offset, $recordsPerPage);
        $totalCustomers = $this->CustomerModel->getTotalActiveCustomers(); // Add a method to get the total count

        // Calculate total number of pages
        $totalPages = ceil($totalCustomers / $recordsPerPage);

        // Ensure $pageNumber is within valid range
        $pageNumber = max(1, min($pageNumber, $totalPages));

        $data = [
            'title' => 'Customers',
            'customers' => $customers,
            'activeCustomers' => $totalCustomers,
            'currentPage' => $pageNumber,
            'recordsPerPage' => $recordsPerPage,
            'totalPages' => $totalPages,
        ];

        $this->view('customers/overview', $data);
    }
    public function updateImage($params)
    {
        $customerId = $params['customerId'];
        $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        global $var;
        $screenId = $var['rand'];

        // Ensure that the imageUploader function returns an array
        $imageUploaderResult = $this->imageUploader($screenId);

        if (is_array($imageUploaderResult) && isset($imageUploaderResult['status'])) {
            if ($imageUploaderResult['status'] === 200 && strpos($imageUploaderResult['message'], 'Image uploaded successfully') !== false) {
                $entity = 'customer';
                $this->screenModel->insertScreenImages($screenId, $customerId, $entity, $post);
                header('Location:' . URLROOT . 'Customer/update/{customerId:' . $customerId . ';' . 'toast:true;toasttitle:Success;toastmessage:Your+create+of+the+Customer+was+successful}');
            } else {
                Helper::log('error', $imageUploaderResult);
                header('Location:' . URLROOT . 'Customer/update/{customerId:' . $customerId . ';' . 'toast:true;toasttitle:Error;toastmessage:Customer+upload+failed}');
            }
        } else {
            // Handle the case where $imageUploaderResult is not an array
            Helper::log('error', 'Invalid response from imageUploader function');
            header('Location:' . URLROOT . 'Customer/update/{customerId:' . $customerId . ';' . 'toast:true;toasttitle:Error;toastmessage:Image+upload+failed}');
        }
    }


    public function deleteImage($params)
    {
        $screenId = $params['screenId'];
        $customerId = $params['customerId'];
        if ($this->screenModel->deleteScreen($screenId)) {
            header('Location:' . URLROOT . 'Customer/update/{customerId:' . $customerId . ';' . 'toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Customer+profile+was+successful}');
        } else {
            header('Location:' . URLROOT . 'Customer/update/{customerId:' . $customerId . ';' . 'toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Customer+profile+has+failed}');
        }
    }

    public function update($params = null)
    {
        $customerId = $params['customerId'];
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Process the form submission
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $this->CustomerModel->update($post);
            header('Location:' . URLROOT . 'Customer/overview/{toast:true;toasttitle:Success;toastmessage:Your+update+of+the+Customer+was+successful}');
        } else {
            // Display the form
            $customer = $this->CustomerModel->getSingleCustomer($customerId);
            $image = $this->screenModel->getScreenDataById($customerId, 'customer', 'main');
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
                'title' => '<h3>Update customer</h3>',
                'customer' => $customer,
                'imageSrc' => $imageSrc,
                'image' => $image
            ];

            $this->view('customers/update', $data);
        }
    }



    public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $this->CustomerModel->create($post);

            header('Location:' . URLROOT . 'Customer/overview/{toast:true;toasttitle:Success;toastmessage:Your+create+of+the+Customer+was+successful}');
            exit;
        } else {
            $data = [
                'title' => 'Create customer',
            ];
            $this->view('customers/create', $data);
        }
    }

    public function delete($params = NULL)
    {
        $customerId = $params['customerId'];
        if (!$this->CustomerModel->delete($customerId)) {
            header('Location:' . URLROOT . 'Customer/overview/{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Customer+was+successful}');
            exit;
        }
    }
}
