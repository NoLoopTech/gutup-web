<?php
// Load environment variables
function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Parse key=value pairs
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            // Set as environment variable if not already set
            if (!getenv($key)) {
                putenv("$key=$value");
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }
    }
}

// Load .env files (try development first, then production)
$envPath = dirname(__DIR__) . '/.env.development.local';
if (!file_exists($envPath)) {
    $envPath = dirname(__DIR__) . '/.env.local';
}
if (!file_exists($envPath)) {
    $envPath = dirname(__DIR__) . '/.env';
}
loadEnv($envPath);

// Store URLs - using app deep links to open directly in store apps
define('PLAY_STORE_URL', getenv('PLAY_STORE_URL') ?: 'market://details?id=com.gutup.app');
define('PLAY_STORE_WEB_URL', getenv('PLAY_STORE_WEB_URL') ?: 'https://play.google.com/store/apps/details?id=com.gutup.app');
define('APP_STORE_URL', getenv('APP_STORE_URL') ?: 'https://apps.apple.com/us/app/gutup-trust-your-gut/id6738651172');

// Server-side device detection
function detectDevice() {
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    // Check for iOS devices
    if (preg_match('/(iPad|iPhone|iPod)/i', $userAgent)) {
        return 'ios';
    }

    // Check for Mac (desktop users might share from Mac)
    if (preg_match('/(Macintosh|MacIntel|MacPPC|Mac68K)/i', $userAgent)) {
        return 'ios';
    }

    // Check for Android
    if (preg_match('/android/i', $userAgent)) {
        return 'android';
    }

    // Default to unknown
    return 'unknown';
}

$device = detectDevice();
$primaryStore = ($device === 'android') ? 'android' : 'ios';
$redirectUrl = ($device === 'android') ? PLAY_STORE_URL : (($device === 'ios') ? APP_STORE_URL : '');

// Function to render store card
function renderStoreCard($type) {
    $playStoreWebUrl = PLAY_STORE_WEB_URL;
    $appStoreUrl = APP_STORE_URL;

    if ($type === 'android') {
        $platform = 'Android';
        $storeUrl = $playStoreWebUrl;
        $badgeImg = 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';
        $badgeAlt = 'Get it on Google Play';
    } else {
        $platform = 'iOS';
        $storeUrl = $appStoreUrl;
        $badgeImg = 'https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&releaseDate=1722556800';
        $badgeAlt = 'Download on the App Store';
    }
    ?>
    <div class="store-card">
        <div class="store-card-header">
            <div class="store-label">Mobile/Tablet</div>
            <div class="store-platform"><?php echo htmlspecialchars($platform); ?></div>
        </div>
        <div class="store-button-wrapper">
            <a href="<?php echo htmlspecialchars($storeUrl); ?>" class="store-button" target="_blank" rel="noopener noreferrer">
                <img src="<?php echo htmlspecialchars($badgeImg); ?>" alt="<?php echo htmlspecialchars($badgeAlt); ?>">
            </a>
        </div>
    </div>
    <?php
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <?php if ($redirectUrl): ?>
    <meta http-equiv="refresh" content="2;url=<?php echo htmlspecialchars($redirectUrl); ?>">
    <?php endif; ?>

    <!-- Primary Meta Tags -->
    <title>GutUp - Trust your gut</title>
    <meta name="title" content="GutUp - Trust your gut">
    <meta name="description" content="Share recipes, track your gut health, and discover delicious meals with GutUp. Download the app now!">
    <meta name="keywords" content="GutUp, recipes, gut health, food tracking, meal planning">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://gutup.com/">
    <meta property="og:title" content="GutUp - Trust your gut">
    <meta property="og:description" content="Share recipes, track your gut health, and discover delicious meals with GutUp. Download the app now!">
    <meta property="og:image" content="/logo/logo.png">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://gutup.com/">
    <meta property="twitter:title" content="GutUp - Trust your gut">
    <meta property="twitter:description" content="Share recipes, track your gut health, and discover delicious meals with GutUp. Download the app now!">
    <meta property="twitter:image" content="/logo/logo.png">

    <!-- Favicon -->
    <link rel="icon" href="/logo/logo.png" type="image/png">

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #EBEBEB;
            min-height: 100vh;
            padding: 0;
            margin: 0;
        }


        .page-header {
            text-align: center;
            padding: 20px 15px 15px;
            background: #EBEBEB;
        }

        .page-title {
            font-size: 20px;
            font-weight: 600;
            color: #1A1A1A;
            margin-bottom: 6px;
        }

        .page-subtitle {
            font-size: 15px;
            color: #666;
            font-weight: 400;
        }

        .logo-container {
            text-align: center;
            padding: 15px 15px;
            background: #EBEBEB;
        }

        .logo {
            width: 180px;
            height: auto;
            margin: 0 auto;
            display: block;
        }

        .tagline {
            font-size: 14px;
            color: #444;
            text-align: center;
            margin: 0;
            padding: 15px 25px 20px;
            line-height: 1.5;
            background: #EBEBEB;
        }

        .store-card {
            background: white;
            border-radius: 14px;
            padding: 18px 22px;
            margin: 0 15px 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .store-card-header {
            margin-bottom: 12px;
        }

        .store-label {
            font-size: 12px;
            color: #888;
            margin-bottom: 5px;
            font-weight: 500;
        }

        .store-platform {
            font-size: 26px;
            font-weight: 700;
            color: #1A1A1A;
            margin-bottom: 0;
            line-height: 1.2;
        }

        .store-button-wrapper {
            position: relative;
            display: inline-block;
            margin-top: 10px;
        }

        .store-button {
            display: block;
            transition: opacity 0.2s;
        }

        .store-button img {
            height: 44px;
            width: auto;
        }

        .store-button:hover {
            opacity: 0.85;
        }

        .divider-section {
            background: #D8EDD8;
            padding: 18px 0;
            margin: 0;
            width: 100%;
        }

        .divider-title {
            font-size: 15px;
            font-weight: 600;
            color: #1A1A1A;
            text-align: center;
            margin-bottom: 8px;
            line-height: 1.3;
            padding: 0 20px;
        }

        .divider-text {
            font-size: 13px;
            color: #555;
            text-align: center;
            line-height: 1.5;
            padding: 0 20px;
        }

        .container {
            max-width: 420px;
            width: 100%;
            margin: 0 auto;
            background: #EBEBEB;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            padding-bottom: 0;
        }

        .redirecting {
            display: none;
        }

        .green-section {
            background: #D8EDD8;
            width: 100%;
            padding-top: 0;
            padding-bottom: 25px;
            flex-grow: 1;
        }


        .green-section .store-card {
            background: white;
        }

        .green-section .redirecting {
            text-align: center;
            color: #444;
            padding-top: 10px;
        }

        @media (max-width: 768px) {
            body {
                overflow-y: auto;
                align-items: flex-start;
                padding: 15px 0;
            }

            .container {
                padding-bottom: 20px;
            }
        }

        /* Mobile devices */
        @media (max-width: 480px) {
            .page-header {
                padding: 15px 20px 10px;
            }

            .page-title {
                font-size: 20px;
                margin-bottom: 4px;
            }

            .page-subtitle {
                font-size: 14px;
            }

            .logo-container {
                padding: 10px 20px;
            }

            .logo {
                width: 160px;
            }

            .tagline {
                font-size: 13px;
                padding: 10px 24px 15px;
                line-height: 1.45;
            }

            .store-card {
                margin: 0 20px 10px;
                padding: 16px 20px;
            }

            .store-card-header {
                margin-bottom: 10px;
            }

            .store-label {
                font-size: 11px;
                margin-bottom: 4px;
            }

            .store-platform {
                font-size: 24px;
                margin-bottom: 0;
            }

            .store-button-wrapper {
                margin-top: 8px;
            }

            .store-button img {
                height: 42px;
            }

            .divider-section {
                padding: 15px 0;
                width: 100%;
            }

            .divider-title {
                font-size: 15px;
                margin-bottom: 6px;
                padding: 0 20px;
            }

            .divider-text {
                font-size: 12px;
                line-height: 1.45;
                padding: 0 20px;
            }
        }

        /* Small mobile devices */
        @media (max-width: 360px) {
            .page-header {
                padding: 12px 16px 8px;
            }

            .page-title {
                font-size: 18px;
                margin-bottom: 3px;
            }

            .page-subtitle {
                font-size: 13px;
            }

            .logo-container {
                padding: 8px 16px;
            }

            .logo {
                width: 140px;
            }

            .tagline {
                font-size: 12px;
                padding: 8px 20px 12px;
                line-height: 1.4;
            }

            .store-card {
                margin: 0 16px 8px;
                padding: 14px 18px;
            }

            .store-card-header {
                margin-bottom: 8px;
            }

            .store-label {
                font-size: 10px;
                margin-bottom: 3px;
            }

            .store-platform {
                font-size: 22px;
            }

            .store-button-wrapper {
                margin-top: 6px;
            }

            .store-button img {
                height: 38px;
            }

            .divider-section {
                padding: 12px 0;
                width: 100%;
            }

            .divider-title {
                font-size: 14px;
                margin-bottom: 5px;
                padding: 0 16px;
            }

            .divider-text {
                font-size: 11px;
                line-height: 1.4;
                padding: 0 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="page-header">
            <h1 class="page-title">Open in the App</h1>
            <p class="page-subtitle">Download</p>
        </div>

        <div class="logo-container">
            <img src="/app-link-assets/gutup-logo.svg" alt="GutUp Logo" class="logo">
        </div>

        <p class="tagline">
            Taking care of your health has never been so easy or so delicious!
        </p>

        <?php if ($device === 'android'): ?>
            <!-- Android detected - show Play Store prominently -->
            <?php renderStoreCard('android'); ?>

            <div class="green-section">
                <div class="divider-section">
                    <div class="divider-title">Other download options</div>
                    <div class="divider-text">Taking care of your health has never been so easy or so delicious!</div>
                </div>

                <?php renderStoreCard('ios'); ?>

                <p class="redirecting">Redirecting to Google Play Store...</p>
            </div>


        <?php elseif ($device === 'ios'): ?>
            <!-- iOS detected - show App Store prominently -->
            <?php renderStoreCard('ios'); ?>

            <div class="green-section">
                <div class="divider-section">
                    <div class="divider-title">Other download options</div>
                    <div class="divider-text">Taking care of your health has never been so easy or so delicious!</div>
                </div>

                <?php renderStoreCard('android'); ?>

                <p class="redirecting">Redirecting to App Store...</p>
            </div>

        <?php else: ?>
            <!-- Unknown device - show both equally -->
            <?php renderStoreCard('ios'); ?>

            <div class="green-section">
                <div class="divider-section">
                    <div class="divider-title">Other download options</div>
                    <div class="divider-text">Taking care of your health has never been so easy or so delicious!</div>
                </div>

                <?php renderStoreCard('android'); ?>
            </div>
        <?php endif; ?>


    </div>

    <?php if ($redirectUrl): ?>

    <script>
        (function() {
            var redirectUrl = '<?php echo addslashes($redirectUrl); ?>';
            var isAndroid = /android/i.test(navigator.userAgent);
            var fallbackUrl = isAndroid ? '<?php echo addslashes(PLAY_STORE_WEB_URL); ?>' : redirectUrl;

            setTimeout(function() {
                if (isAndroid) {
                    // Try to open Play Store app directly
                    window.location.href = redirectUrl;

                    // Fallback to web URL if app doesn't open
                    setTimeout(function() {
                        window.location.href = fallbackUrl;
                    }, 500);
                } else {
                    // For iOS, the https:// URL works for both web and app
                    window.location.href = redirectUrl;
                }
            }, 1500);
        })();
    </script>
    <?php endif; ?>
</body>
</html>
