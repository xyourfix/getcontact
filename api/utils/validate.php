<?php
function validateNumber($number) {
    if (empty($number)) {
        throw new Exception('Number is not defined');
    }
    
    // Remove spaces and dashes
    $number = preg_replace('/[\s-]/', '', $number);
    
    if (substr($number, 0, 1) === '0') {
        $number = '+62' . substr($number, 1);
    }
    
    if (substr($number, 0, 2) === '62') {
        $number = '+' . $number;
    }
    
    return $number;
}
?>