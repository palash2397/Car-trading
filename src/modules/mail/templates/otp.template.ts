export const getOtpEmailTemplate = (otp: string, userName: string = 'User') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification - Car Trading</title>
    <style>
        body {
            font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .header {
            background-color: #1a1a2e; /* Deep automotive blue/black */
            padding: 30px 20px;
            text-align: center;
            border-bottom: 3px solid #e94560; /* Accent red for cars */
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 25px;
            color: #555555;
        }
        .otp-container {
            background-color: #f8f9fa;
            border: 2px dashed #cbd5e1;
            border-radius: 6px;
            padding: 20px;
            margin: 30px auto;
            max-width: 300px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: 700;
            color: #1a1a2e;
            letter-spacing: 6px;
            margin: 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #888888;
            border-top: 1px solid #eeeeee;
        }
        .warning {
            font-size: 13px;
            color: #888888;
            margin-top: 30px;
        }
        .icon {
            font-size: 40px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Car Trading</h1>
        </div>
        <div class="content">
            <div class="icon">🚗</div>
            <h2>Verify Your Account</h2>
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Thank you for choosing Car Trading. To complete your registration and hit the road with us, please use the verification code below:</p>
            
            <div class="otp-container">
                <p class="otp-code"><strong>${otp}</strong></p>
            </div>
            
            <p>This code is valid for the next <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
            
            <p class="warning">If you did not request this verification, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p><strong>&copy; ${new Date().getFullYear()} Car Trading. All rights reserved.</strong></p>
            <p><strong>123 Automotive Blvd, Motor City</strong></p>
        </div>
    </div>
</body>
</html>
`;
