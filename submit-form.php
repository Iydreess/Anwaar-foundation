<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit;
}

$recipient = 'info@anwaarfoundation.com';
$formType = isset($_POST['formType']) ? trim((string) $_POST['formType']) : 'general-inquiry';

$allowedTypes = [
    'contact-inquiry',
    'volunteer-application',
    'partnership-inquiry',
    'general-inquiry',
    'newsletter'
];

if (!in_array($formType, $allowedTypes, true)) {
    $formType = 'general-inquiry';
}

$email = isset($_POST['email']) ? trim((string) $_POST['email']) : '';
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please provide a valid email address.'
    ]);
    exit;
}

if ($formType === 'newsletter' && $email === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Email is required for newsletter subscription.'
    ]);
    exit;
}

if ($formType !== 'newsletter') {
    $name = isset($_POST['name']) ? trim((string) $_POST['name']) : '';
    $message = isset($_POST['message']) ? trim((string) $_POST['message']) : '';

    if ($name === '' || $email === '' || $message === '') {
        http_response_code(422);
        echo json_encode([
            'success' => false,
            'message' => 'Please complete all required fields.'
        ]);
        exit;
    }
}

$subjectPrefix = 'Anwaar Foundation Website';
$subject = $subjectPrefix . ' - ' . strtoupper(str_replace('-', ' ', $formType));

$lines = [];
$lines[] = 'Submission Type: ' . $formType;
$lines[] = 'Submitted At (UTC): ' . gmdate('Y-m-d H:i:s');
$lines[] = 'IP Address: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$lines[] = '';
$lines[] = 'Submitted Data:';

foreach ($_POST as $key => $value) {
    if ($key === 'formType') {
        continue;
    }

    if (is_array($value)) {
        $safeValue = implode(', ', array_map(static fn($item): string => trim((string) $item), $value));
    } else {
        $safeValue = trim((string) $value);
    }

    $label = ucwords(str_replace(['_', '-'], ' ', (string) $key));
    $lines[] = $label . ': ' . $safeValue;
}

$body = implode("\r\n", $lines);

$fromAddress = 'no-reply@anwaarfoundation.com';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: Anwaar Foundation Website <' . $fromAddress . '>'
];

if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

$sent = mail($recipient, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'We could not send your submission right now. Please try again shortly.'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Submission received successfully.'
]);
