<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Access denied: Use the contact form");
}

$to = "it@akcrust.com";
$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
$subject = filter_var($_POST['subject'], FILTER_SANITIZE_STRING);
$message = htmlspecialchars($_POST['message']);

if (!$email) {
    header('Location: /Pages/contact.html?status=invalid_email');
    exit;
}

$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . $email,
    'Reply-To: ' . $email
];

if (mail($to, "[AK Crust] $subject", $message, implode("\r\n", $headers))) {
    header('Location: /Pages/thankyou.html');
} else {
    header('Location: /Pages/contact.html?status=mail_error');
}