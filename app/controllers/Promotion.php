<?php
class Promotion extends Controller
{

    private $PromotionModel;
    private $ScreenModel;



    public function __construct()
    {
        $this->PromotionModel = $this->model('PromotionModel');
        $this->ScreenModel = $this->model('ScreenModel');
    }


    public function overview($page = 1)
    {
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $perPage = 1; 
        $promotions = $this->PromotionModel->getPromotions($page, $perPage);
        $totalPromotions= $this->PromotionModel->getTotalActivePromotions(); // Add a method to get the total count

        Helper::log('error', 'dit is faya man');
        $data = [
            'title' => 'promotions',
            'promotions' => $promotions,
            'totalPromotions' => $totalPromotions,
            'currentPage' => $page,
            'perPage' => $perPage,

        ];
        $this->view('promotions/overview', $data);
    }
    public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $this->PromotionModel->create($post);
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your create of the promotion was successfull');
            header('Location:' . URLROOT . 'Promotion/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
        } else {
            $data = [
                'title' => 'Create promotion',
            ];
            $this->view('promotions/create', $data);
        }
    }

    public function update($promotionId = null)
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Process the form submission
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $this->PromotionModel->update($post);
            header('Location:' . URLROOT . 'Promotion/overview/{toast:true;toasttitle:Success;toastmessage:Your+update+of+the+promotion+was+successful}');
        } else {
            // Display the form
            $promotions = $this->PromotionModel->getSinglePromotion($promotionId);
            $images = $this->ScreenModel->getScreensDataById($promotionId, 'promotion');
            if ($images !== false) {
                // Check if the necessary properties exist before accessing them
                foreach ($images as $image) :
                    if (property_exists($image, 'screenCreateDate') && property_exists($image, 'screenId')) {
                        $createDate = date('Ymd', $image->screenCreateDate);
                        $image->imagePath = URLROOT . 'public/media/' . $createDate . '/' . $image->screenId . '.jpg';
                    } else {
                        // Handle the case where expected properties are missing
                        $image->imagePath = URLROOT . 'public/default-image.jpg';
                    }
                endforeach;
            }
            // Helper::dump($images); exit;


            $data = [
                'title' => '<h3>Update promotions</h3>',
                'promotions' => $promotions,
                'images' => $images
            ];

            $this->view('promotions/update', $data);
        }
    }

    public function updateImage($promotionId)
    {
        $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        global $var;
        $screenId = $var['rand'];

        // Ensure that the imageUploader function returns an array
        $imageUploaderResult = $this->imageUploader($screenId);

        if (is_array($imageUploaderResult) && isset($imageUploaderResult['status'])) {
            if ($imageUploaderResult['status'] === 200 && strpos($imageUploaderResult['message'], 'Image uploaded successfully') !== false) {
                $entity = 'promotion';
                $this->ScreenModel->insertScreenImagesScope($screenId, $promotionId, $entity, $post);
                header('Location:' . URLROOT . 'Promotion/update/' . $promotionId . '/{toast:true;toasttitle:Success;toastmessage:Your+create+of+the+Promotion+was+successful}');
            } else {
                Helper::log('error', $imageUploaderResult);
                header('Location:' . URLROOT . 'Promotion/update/' . $promotionId . '/{toast:true;toasttitle:Error;toastmessage:Promotion+upload+failed}');
            }
        } else {
            // Handle the case where $imageUploaderResult is not an array
            Helper::log('error', 'Invalid response from imageUploader function');
            header('Location:' . URLROOT . 'Promotion/update/' . $promotionId . '/{toast:true;toasttitle:Error;toastmessage:Image+upload+failed}');
        }
    }

    public function deleteImage($ids)
    {
        $ids = explode("+", $ids);
        if ($this->ScreenModel->deleteScreen($ids[0])) {
            header('Location:' . URLROOT . 'Promotion/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Promotion+was+successful}');
        } else {
            header('Location:' . URLROOT . 'Promotion/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Promotion+has+failed}');
        }
    }


    public function delete($promotionId)
    {
        if ($this->PromotionModel->delete($promotionId)) {
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your delete of the promotion was successfull');
            header('Location:' . URLROOT . 'Promotion/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
        } else {
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your delete of the promotion was successfull');
            header('Location:' . URLROOT . 'Promotion/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
        }
    }
}
