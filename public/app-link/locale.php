<?php
/**
 * Localization file for GutUp app-link page
 * Contains translations for different languages
 */

// Language detection from browser
function detectLanguage() {

    $acceptLang = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'en';

    preg_match('/^([a-z]{2})/', strtolower($acceptLang), $matches);
    $lang = $matches[1] ?? 'en';

    $supportedLangs = ['en', 'fr'];
    return in_array($lang, $supportedLangs) ? $lang : 'en';
}

// Translations
function getTranslations($lang) {
    $translations = [
        'en' => [
            'title' => 'Trust Your Gut.',
            'start_with' => 'Start with',
            'gutup' => 'GutUp',
            'tagline' => 'Taking care of your health has never been so easy or so delicious!',
            'download_title' => 'Download GutUp',
            'mobile_tablet' => 'Mobile/Tablet',
            'android' => 'Android',
            'ios' => 'iOS',
            'other_options_title' => 'Other download options',
            'other_options_text' => 'Not your device? Choose the right app for your platform.',
            'meta_description' => 'Share recipes, track your gut health, and discover delicious meals with GutUp. Download the app now!',
            'badge_alt_google_play' => 'Get it on Google Play',
            'badge_alt_app_store' => 'Download on the App Store',
        ],
        'fr' => [
            'title' => 'Trust Your Gut.',
            'start_with' => 'Start with',
            'gutup' => 'GutUp',
            'tagline' => 'Taking care of your health has never been so easy or so delicious!',
            'download_title' => 'Download GutUp',
            'mobile_tablet' => 'Mobile/Tablet',
            'android' => 'Android',
            'ios' => 'iOS',
            'other_options_title' => 'Other download options',
            'other_options_text' => 'Not your device? Choose the right app for your platform.',
            'meta_description' => 'Share recipes, track your gut health, and discover delicious meals with GutUp. Download the app now!',
            'badge_alt_google_play' => 'Disponible sur Google Play',
            'badge_alt_app_store' => 'Télécharger dans l\'App Store',
        ],
    ];

    return $translations[$lang] ?? $translations['en'];
}
?>
