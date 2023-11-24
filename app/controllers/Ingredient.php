<?php
class Ingredient extends Controller
{

    private $IngredientModel;
    private $screenModel;

    public function __construct()
    {
        $this->IngredientModel = $this->model('IngredientModel');
        $this->screenModel = $this->model('ScreenModel');
    }


    public function overview($page = 1)
    {
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $perPage = 1; // Adjust this value based on your needs
        $ingredients = $this->IngredientModel->getIngredients($page, $perPage);
        $totalIngredienten = $this->IngredientModel->getTotalActiveIngredienten(); // Add a method to get the total count
        $data = [
            'title' => 'ingredients',
            'ingredients' => $ingredients,
            'totalIngredienten' => $totalIngredienten,
            'currentPage' => $page,
          'perPage' => $perPage,

        ];
        $this->view('ingredients/overview', $data);
    }

    public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $this->IngredientModel->create($post);
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your create of the ingredient was successfull');
            header('Location:' . URLROOT . 'Ingredient/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
        } else {
            $data = [
                'title' => 'Create ingredients'
            ];
            $this->view('ingredients/create', $data);
        }
    }

    public function update($ingredientId = null)
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Process the form submission
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $result = $this->IngredientModel->update($post);

            if (!$result) {
                // Form submission was successful
                $toast = urlencode('true');
                $toasttitle = urlencode('Success');
                $toastmessage = urlencode('Your update of the ingredient was successful');
            } else {
                // Form submission failed
                $toast = urlencode('false');
                $toasttitle = urlencode('Failed');
                $toastmessage = urlencode('Your update of the ingredient has failed');
            }

            // Redirect with feedback parameters
            header('Location:' . URLROOT . 'Ingredient/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
        } else {
            // Display the form
            $ingredient = $this->IngredientModel->getSingleIngredient($ingredientId);
            $image = $this->screenModel->getScreenDataById($ingredientId, 'ingredient', 'main');
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
                'title' => '<h3>Update ingredient</h3>',
                'ingredient' => $ingredient,
                'imageSrc' => $imageSrc,
                'image' => $image
            ];

            $this->view('ingredients/update', $data);
        }
    }

    public function updateImage($ingredientId)
{
    $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    global $var;
    $screenId = $var['rand'];
    
    // Ensure that the imageUploader function returns an array
    $imageUploaderResult = $this->imageUploader($screenId);
    
    if (is_array($imageUploaderResult) && isset($imageUploaderResult['status'])) {
        if ($imageUploaderResult['status'] === 200 && strpos($imageUploaderResult['message'], 'Image uploaded successfully') !== false) {
            $entity = 'ingredient';
            $this->screenModel->insertScreenImages($screenId, $ingredientId, $entity, $post);
            header('Location:' . URLROOT . 'Ingredient/update/' . $ingredientId . '/{toast:true;toasttitle:Success;toastmessage:Your+create+of+the+Ingredient+was+successful}');
        } else {
            Helper::log('error', $imageUploaderResult);
            header('Location:' . URLROOT . 'Ingredient/update/' . $ingredientId . '/{toast:true;toasttitle:Error;toastmessage:Ingredient+upload+failed}');
        }
    } else {
        // Handle the case where $imageUploaderResult is not an array
        Helper::log('error', 'Invalid response from imageUploader function');
        header('Location:' . URLROOT . 'Ingredient/update/' . $ingredientId . '/{toast:true;toasttitle:Error;toastmessage:Image+upload+failed}');
    }
}
    
    
        public function deleteImage($ids)
        {
            $ids = explode("+", $ids);
            if ($this->screenModel->deleteScreen($ids[0])) {
                header('Location:' . URLROOT . 'Ingredient/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Ingredient+was+successful}');
    
            } else {
                header('Location:' . URLROOT . 'Ingredient/update/' . $ids[1] . '/' . '{toast:true;toasttitle:Success;toastmessage:Your+delete+of+the+Ingredient+has+failed}');
    
            }
        }


    public function delete($ingredientId)
    {
        if ($this->IngredientModel->delete($ingredientId)) {
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your delete of the ingredient was successfull');
            header('Location:' . URLROOT . 'Ingredient/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
        } else {
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your delete of the ingredient was successfull');
            header('Location:' . URLROOT . 'Ingredient/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
        }
    }
}
