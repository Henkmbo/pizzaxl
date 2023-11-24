<?php
class Helper
{
    public static function dump($content, $type = null, $label = null)
    {
        // Start with an opening <pre> tag for better formatting in HTML
        echo "<pre>";

        // Display the label if provided
        if ($label !== null) {
            echo "<h1>" . $label . "</h1>";
        }

        if ($type == 'error' || $type == 'Error') {
            echo "<h2 style='color: red;'>ERROR:::</h2>";
            print_r($content);
            echo "<h2 style='color: red;'>:::ERROR</h2>";
        } elseif ($type == 'event' || $type == 'Event') {
            echo "<h2 style='color: blue;'>EVENT:::</h2>";
            print_r($content);
            echo "<h2 style='color: blue;'>:::EVENT</h2>";
        } elseif ($type == 'debug' || $type == 'Debug') {
            echo "<h2 style='color: orange;'>DEBUG:::</h2>";
            print_r($content);
            echo "<h2 style='color: orange;'>:::DEBUG</h2>";
        } else {
            // Use var_dump to display the content
            print_r($content);
        }

        // Close the <pre> tag for better formatting
        echo "</pre>";
    }

    public static function log($type, $data){
        if ($type=='event') {
            error_log( 'Event: ' . date('Ymd h:i:s') . " - " . $data );
        }
        else if ($type=='error') {
            $bt = debug_backtrace();
            $caller = array_shift($bt);
            error_log( 'Error: ' . date('Ymd h:i:s') . " - " . $caller['line'] . ' ' . $caller['file'] . "\n" . $data );
        }
        else if ($type=='debug') {
            $bt = debug_backtrace();
            $caller = array_shift($bt);
            error_log( "\n" . date('Ymd h:i:s') . "\n" . $caller['line'] . ' ' . $caller['file'] . "\n" . print_r( $data, true ) . "\n");
        }
    }
    
static function crypt($action, $string) {
    $output = false;

    $encrypt_method = "AES-256-CBC";
    $secret_key = 'This is my secret key';
    $secret_iv = 'This is my secret iv';

    // hash
    $key = hash('sha256', $secret_key);

    // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
    $iv = substr(hash('sha256', $secret_iv), 0, 16);

    if( $action == 'encrypt' ) {
        $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
        $output = base64_encode($output);
    }
    else if( $action == 'decrypt' ){
        $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
    }

    return $output;
}

}