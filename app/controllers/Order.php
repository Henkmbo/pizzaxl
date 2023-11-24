<?php
Class Order extends Controller
{

  private $OrderModel;
  private $CustomerModel;
  private $StoreModel;



  public function __construct()
  {
    $this->OrderModel = $this->model('OrderModel');
    $this->CustomerModel = $this->model('CustomerModel');
    $this->StoreModel = $this->model('StoreModel');

  }


  public function overview($page = 1)
  {
      $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
      $perPage = 1;
      
      $orders = $this->OrderModel->getOrders($page, $perPage);
      $totalOrders = $this->OrderModel->getTotalActiveOrders();
      
      // Calculate the total number of pages
      $totalPages = ceil($totalOrders / $perPage);
  
      $data = [
          'title' => 'orders',
          'orders' => $orders,
          'activeOrders' => $totalOrders,
          'currentPage' => $page,
          'perPage' => $perPage,
          'totalPages' => $totalPages,
      ];
  
      $this->view('orders/overview', $data);
  }
  

  public function update($orderId = null)
  {
      if ($_SERVER['REQUEST_METHOD'] === 'POST')
      {
          $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
          $result = $this->OrderModel->update($post);
          if (!$result) {
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your update of the order was successfull');
            header('Location:' . URLROOT . 'Order/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);       
         }  else {
            $toast = urlencode('false');
            $toasttitle = urlencode('failed');
            $toastmessage = urlencode('Your update of the order has failed');
            header('Location:' . URLROOT . 'Order/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
            exit; 
        }

      } else{
          $order = $this->OrderModel->getSingleOrder($orderId);
          $StoreName = $this->StoreModel->getStoreById($order->orderStoreId);
          global $orderState;
          global $orderStatus;
        //   Helper::dump($order);exit;
          $data = [
              'title' => '<h3>Update orders</h3>',
              'order' => $order,
              'StoreName' => $StoreName,
              'orderState' => $orderState,
              'orderStatus' => $orderStatus
          ];
          $this->view('orders/update', $data);
      }
  }
  
  public function create()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $post = filter_input_array(INPUT_POST, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
            $this->OrderModel->create($post);
            // phpinfo(); exit;
            $toast = urlencode('true');
            $toasttitle = urlencode('Succes');
            $toastmessage = urlencode('Your create of the order was successfull');
            header('Location:' . URLROOT . 'Order/overview/' . $toast . '/' . $toasttitle . '/' . $toastmessage);
    } else {
            $customers = $this->CustomerModel->getCustomers();
            $stores = $this->StoreModel->getStores();
            global $orderState;
            global $orderStatus;
            $data = [
                'title' => 'Create Order',
                'customers' => $customers,
                'stores' => $stores,
                'orderStatus' => $orderStatus,
                'orderState' => $orderState,

            ];
            $this->view('orders/create', $data);
        }
    }
    public function read($orderId) {
    
        $productByOrder = $this->OrderModel->getProductByOrder($orderId);
        $activeOrderCount = count($this->OrderModel->getProductByOrder($orderId));
        $data = [
              'title' => 'orders',
              'productByOrder' => $productByOrder,
              'activeOrders' => $activeOrderCount,
    
          ];
          $this->view('orders/read', $data);
      }

}
