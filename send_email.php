<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "it@akcrust.com";
    $subject = "[AK Crust Contact] " . $_POST['subject'];
    $message = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
    </head>
    <body>
        <h2>New Message from Production Dashboard</h2>
        <p><strong>Name:</strong> ".htmlspecialchars($_POST['name'])."</p>
        <p><strong>Email:</strong> ".htmlspecialchars($_POST['email'])."</p>
        <p><strong>Subject:</strong> ".htmlspecialchars($_POST['subject'])."</p>
        <p><strong>Message:</strong><br>".nl2br(htmlspecialchars($_POST['message']))."</p>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: ".htmlspecialchars($_POST['email'])."\r\n";
    $headers .= "Reply-To: ".htmlspecialchars($_POST['email'])."\r\n";
    
    if (mail($to, $subject, $message, $headers)) {
        header('Location: /thank-you.html');
    } else {
        header('Location: /contact.html?status=error');
    }
}
?>