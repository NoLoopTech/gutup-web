<?php
// Store URLs - using app deep links to open directly in store apps
define('PLAY_STORE_URL', 'market://details?id=com.gutup.app');
define('PLAY_STORE_WEB_URL', 'https://play.google.com/store/apps/details?id=com.gutup.app');
define('APP_STORE_URL', 'https://apps.apple.com/ch/app/gutup-trust-your-gut/id6751872478');

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
        // Self-hosted official Google Play badge (PNG)
        $badgeImg = '/app-link-assets/GetItOnGooglePlay.png';
        $badgeAlt = 'Get it on Google Play';
    } else {
        $platform = 'iOS';
        $storeUrl = $appStoreUrl;
        // Self-hosted official App Store badge (SVG)
        $badgeImg = '/app-link-assets/DownloadOnTheAppStore.svg';
        $badgeAlt = 'Download on the App Store';
    }

    ?>
        <div class="store-card">
            <div class="store-card-header">
                <div class="store-card-text">
                    <div class="store-label">Mobile/Tablet</div>
                    <div class="store-platform"><?php echo htmlspecialchars($platform); ?></div>
                </div>
                <img src="/app-link-assets/download.svg" alt="" class="download-icon">
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

        /* layout toggles */
        .mobile-layout {
            display: block;
        }

        .desktop-layout {
            display: none;
        }

        /* ===== MOBILE LAYOUT (existing) ===== */

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
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
        }

        .store-card-text {
            display: flex;
            flex-direction: column;
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

        .download-icon {
            width: 18px;
            height: 18px;
            display: none; /* only show on desktop */
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
            display: block;
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

        /* ===== DESKTOP LAYOUT ===== */

        @media (min-width: 900px) {
            body {
                background: #ffffff;
                padding: 0;
                overflow: hidden;
                position: relative;
                height: 100vh;
            }

            .mobile-layout {
                display: none;
            }

            .desktop-layout {
                display: block;
            }

            .desktop-page {
                position: relative;
                height: 100vh;
                width: 100%;
                overflow: hidden;
                background: #ffffff;
            }

            .desktop-header {
                background: #FF8B5A;
                padding: 20px 80px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                z-index: 10;
            }

            .desktop-header-logo img {
                height: 36px;
                width: auto;
            }

            .desktop-header-signup {
                font-size: 16px;
                font-weight: 500;
                color: #ffffff;
                text-decoration: none;
            }

            .desktop-header-signup:hover {
                text-decoration: underline;
            }

            .desktop-main {
                padding: 60px 80px;
                position: relative;
                z-index: 2;
                max-width: 1500px;
                margin: 0 auto;
                height: calc(100vh - 76px);
                display: flex;
                align-items: center;
            }

            .desktop-hero {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 60px;
                position: relative;
            }

            .hero-left {
                max-width: 540px;
                flex-shrink: 0;
            }

            .hero-title {
                font-size: 54px;
                line-height: 1.15;
                font-weight: 700;
                color: #000;
                margin-bottom: 20px;
                letter-spacing: -0.4px;
            }

            .hero-title span.highlight {
                color: #FF8B5A;
            }

            .hero-tagline {
                font-size: 20px;
                color: #666;
                line-height: 1.6;
                margin-bottom: 42px;
                max-width: 480px;
            }

            .hero-download-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #000;
            }

            .hero-store-row {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
            }

            .desktop-layout .store-card {
                background: #F7F7F7;
                border-radius: 20px;
                padding: 20px 24px;
                margin: 0;
                box-shadow: none;
                min-width: 240px;
                max-width: 260px;
                border: 1px solid rgba(0, 0, 0, 0.04);
                transition: transform 0.25s ease, box-shadow 0.25s ease;
            }

            .desktop-layout .store-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            }

            .desktop-layout .store-card-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                margin-bottom: 14px;
            }

            .desktop-layout .store-card-text {
                display: block;
            }

            .desktop-layout .store-label {
                font-size: 11px;
                color: #888;
                margin-bottom: 5px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                font-weight: 500;
            }

            .desktop-layout .store-platform {
                font-size: 21px;
                line-height: 1.2;
                font-weight: 700;
                color: #111;
            }
            
            .desktop-layout .download-icon {
                display: block;
                width: 15px;
                height: 15px;
                opacity: 0.7;
                margin-top: 3px;
            }

            .desktop-layout .store-button-wrapper {
                margin-top: 0;
            }

            .desktop-layout .store-button img {
                height: 46px;
                width: auto;
            }

            .hero-right {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                position: relative;
                min-height: 500px;
                padding-right: 0;
            }

            .hero-image {
                max-width: 900px;
                width: 100%;
                height: auto;
                position: relative;
                z-index: 3;
            }


            /* background vectors */
            .bg-shape {
                position: absolute;
                pointer-events: none;
                z-index: 1;
            }

            /* blob-green-lg-top.svg – moderate size, sits behind top-right of phones */
            .bg-green-big-top {
                top: -4%;
                right: 6%;
                width: 38vw;
                min-width: 420px;
                max-width: 520px;
                opacity: 0.9;
                z-index: 1;
            }

            /* blob-green-lg-bottom.svg – sits lower, slightly left of top blob */
            .bg-green-big-bottom {
                bottom: -12%;
                right: 14%;
                width: 34vw;
                min-width: 380px;
                max-width: 480px;
                opacity: 0.9;
                z-index: 1;
            }


            /* blob-orange-lg-bg.svg - Large orange in background */
            .bg-orange-top-bottom {
                top: -100px;
                right: -80px;
                width: 620px;
                height: auto;
                opacity: 0.7;
                z-index: 0;
            }

            /* Small decorative blobs */

            /* blob-green-sm-top.svg - Small blob top right */
            .bg-green-small-top {
                top: 85px;
                right: 11%;
                width: 32px;
                height: auto;
                opacity: 1;
                z-index: 2;
            }

            /* blob-green-sm-right.svg - Small blob far right */
            .bg-green-small-right {
                top: 30%;
                right: 1.5%;
                width: 26px;
                height: auto;
                opacity: 1;
                z-index: 2;
            }

            /* blob-orange-sm-top.svg - Small orange top-left */
            .bg-orange-top-small {
                top: 150px;
                left: 40%;
                width: 24px;
                height: auto;
                opacity: 1;
                z-index: 2;
            }

            /* blob-green-sm-left.svg - Small blob left-center */
            .bg-green-small-left {
                top: 48%;
                left: 32%;
                width: 28px;
                height: auto;
                opacity: 1;
                z-index: 2;
            }

            /* blob-green-sm-bottom.svg - Small blob bottom-center */
            .bg-green-small-bottom {
                bottom: 120px;
                right: 36%;
                width: 32px;
                height: auto;
                opacity: 1;
                z-index: 2;
            }

            /* blob-orange-sm-bottom.svg - Orange blob bottom-left */
            .bg-orange-small-bottom {
                bottom: 90px;
                left: 9%;
                width: 48px;
                height: auto;
                opacity: 1;
                z-index: 2;
            }

            /* blob-orange-sm-side.svg - Orange blob bottom-right */
            .bg-orange-small-side {
                bottom: 110px;
                right: 5%;
                width: 30px;
                height: auto;
                opacity: 1;
                z-index: 2;
            }
        }

        /* For very large screens */
        @media (min-width: 1400px) {
            .desktop-main {
                padding: 80px 120px 120px;
            }

            .hero-left {
                max-width: 560px;
            }

            .hero-title {
                font-size: 56px;
            }

            .hero-tagline {
                font-size: 18px;
            }

            .hero-image {
                max-width: 900px;
            }

            .bg-green-big-top {
                width: 900px;
            }
        }
    </style>
</head>
<body>

    <!-- MOBILE LAYOUT -->
    <div class="mobile-layout">
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
    </div>

    <!-- DESKTOP LAYOUT -->
    <div class="desktop-layout">
        <div class="desktop-page">
            <header class="desktop-header">
                <div class="desktop-header-logo">
                    <img src="/app-link-assets/gutup-logo-desktop.svg" alt="GutUp logo">
                </div>
                <!-- <a href="#" class="desktop-header-signup">Sign up</a> -->
            </header>


            <main class="desktop-main">
                <section class="desktop-hero">
                    <div class="hero-left">
                        <h1 class="hero-title">
                            Trust Your Gut.<br>
                            Start with <span class="highlight">Gutup</span>
                        </h1>
                        <p class="hero-tagline">
                            Taking care of your health has never been so easy or so delicious!
                        </p>

                        <div class="hero-download-title">Download Gutup</div>

                        <div class="hero-store-row">
                            <?php renderStoreCard('android'); ?>
                            <?php renderStoreCard('ios'); ?>
                        </div>
                    </div>

                    <div class="hero-right">
                        <img src="/app-link-assets/gutup-desktop.svg"
                             alt="GutUp app screens"
                             class="hero-image">
                    </div>
                </section>
            </main>

            <!-- background vectors -->
            <img src="/app-link-assets/blob-green-lg-top.svg" alt="" class="bg-shape bg-green-big-top">
            <img src="/app-link-assets/blob-orange-lg-bg.svg" alt="" class="bg-shape bg-orange-top-bottom">
            <img src="/app-link-assets/blob-green-sm-top.svg" alt="" class="bg-shape bg-green-small-top">
            <img src="/app-link-assets/blob-green-sm-right.svg" alt="" class="bg-shape bg-green-small-right">
            <img src="/app-link-assets/blob-orange-sm-top.svg" alt="" class="bg-shape bg-orange-top-small">
            <img src="/app-link-assets/blob-green-sm-left.svg" alt="" class="bg-shape bg-green-small-left">
            <img src="/app-link-assets/blob-green-lg-bottom.svg" alt="" class="bg-shape bg-green-big-bottom">
            <img src="/app-link-assets/blob-green-sm-bottom.svg" alt="" class="bg-shape bg-green-small-bottom">
            <img src="/app-link-assets/blob-orange-sm-bottom.svg" alt="" class="bg-shape bg-orange-small-bottom">
            <img src="/app-link-assets/blob-orange-sm-side.svg" alt="" class="bg-shape bg-orange-small-side">
        </div>
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
