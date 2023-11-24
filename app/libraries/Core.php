<?php
class Core
{
    protected $currentController = 'Homepage';
    protected $currentMethod = 'index';
    protected $params = [];
    public function __construct()
    {
        //get the current url
        $url = $this->getUrl();
        $urlSlug = $url;
        //check if the controller exists for the current url
        if (file_exists(APPROOT . '/controllers/' . ucwords($url[0]) . '.php')) {
            //change the currentcontroller to the controller in the url
            $this->currentController = ucwords($url[0]);
            //destroy the first part of the url after the the urlroot
            // unset($url[0]);
        } else {
        }
        //if the controller doesn't exist then change the controller to $currentController
        require_once APPROOT . '/controllers/' . $this->currentController . '.php';
        //instantiate the controllerClass
        define('CURRENTCONTROLLER', $this->currentController);
        $this->currentController = new $this->currentController();
        //Check if the second part of the url is set and if the method exists
        if (isset($url[1])) {
            if (method_exists($this->currentController, $url[1])) {
                $this->currentMethod = $url[1];
                unset($urlSlug[1]);
            } else if (!empty($url[1])) {
                require APPROOT . '/views/includes/404.php';
                exit;
            }
        }
        $this->params = $url ? $url[2] : '';

        // Ensure $this->params is a string
        if (is_array($this->params)) {
            $this->params = implode('', $this->params);
        }

        // URL decode the string and remove unwanted characters
        $decodedString = str_replace(['{', '}'], '', urldecode($this->params));

        // Explode the string using ';' as the main delimiter
        $pairs = explode(';', $decodedString);
        $array = [];

        // Iterate through each pair and explode using ':' as the delimiter
        foreach ($pairs as $pair) {
            $parts = explode(':', $pair, 2); // Limit to 2 parts to handle values with colons
            if (count($parts) == 2) {
                $array[trim($parts[0], '{}')] = $parts[1];
            }
        }

        call_user_func_array([$this->currentController, $this->currentMethod], [$array]);
    }
    public function getUrl()
    {
        // $_GET['url'] comes from the /public/.htaccess line 7
        $incoming = $_SERVER['REQUEST_URI'];

        // Remove the base URL from the request
        $incoming = str_replace("/PizzaXXL/", "", $incoming);

        // Ensure a trailing slash
        if (!empty($incoming) && substr($incoming, -1)) {
            $incoming;
        }
        if (isset($incoming)) {
            $incoming = trim($incoming, "/");
            $url = filter_var($incoming, FILTER_SANITIZE_URL);
            if (strpos($incoming, '?') !== false) {

                $queryString = substr($incoming, strpos($incoming, '?') + 1);
                // Explode the query string into an array
                $queryParamsArray = explode('&', $queryString);
                // Initialize an associative array to store key-value pairs

                $params = array();
                // Iterate through each key-value pair

                foreach ($queryParamsArray as $pair) {
                    // Split the pair into key and value
                    list($key, $value) = explode('=', $pair);
                    // Add to the associative array
                    $params[$key] = $value;
                }

                // Parse the URL
                $urlParts = parse_url($url);

                // Parse the query string
                parse_str($urlParts['query'], $queryParams);

                // Create the new URL format
                $newUrl = $urlParts['path'] . "{";

                foreach ($params as $key => $value) {
                    $newUrl .= $key . ":" . $value . ";";
                }
                $newUrl .= "}/";

                $urlParams = [];
                foreach ($params as $key => $value) {
                    // Voeg de data toe aan de $urlParams array
                    $urlParams[urldecode($key)] = urldecode($value);
                }

                $pageNumber = isset($urlParams['page']) ? (int)$urlParams['page'] : 1;
                // Helper::dump($pageNumber);

                // Helper::dump($this->params);exit;

                header('Location:' . URLROOT . $newUrl);
                exit;
            }
        }

        // Trim leading and trailing slashes
        $incoming = rtrim($incoming, "/");

        $url = filter_var($incoming, FILTER_SANITIZE_URL);
        $url = explode('/', $url);
        $urlController = $url[0];
        $urlAction = "";
        if (array_key_exists(1, $url)) {
            $urlAction = explode('?', $url[1])[0];
        }

        $urlSlug = $url;
        if (array_key_exists(2, $url)) {
            $urlSlug = $url[2];
        }
        // Helper::dump($urlSlug);exit;

        $output = [$urlController, $urlAction, $urlSlug];

        return $output;
    }
    // $array = [
    //     'hallo' => 'doei'
    // ];
    // foreach ($array as $key => $value) {
    //     echo $key;
    //     echo $value;
    // }
    // Helper::dump($incoming); exit;
    // alles achter de ? pakken en daarmee een foreach maken die de new url hier beneden aanmaakt. data achter de ? worden dus in een array gestop waarmee je kunt foreachen 
    // $newUrl = {page:2;toast:true;}
    // Header location naar URLROOT . controller . method . $newURL
}
