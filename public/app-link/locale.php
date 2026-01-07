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
            'title' => 'Faites confiance à votre instinct.',
            'start_with' => 'Commence avec',
            'gutup' => 'GutUp',
            'tagline' => 'Prendre soin de ta santé n\'a jamais été aussi simple et gourmand !',
            'download_title' => 'Télécharger GutUp',
            'mobile_tablet' => 'Mobile/Tablette',
            'android' => 'Android',
            'ios' => 'iOS',
            'other_options_title' => 'Autres options de téléchargement',
            'other_options_text' => 'Pas votre appareil ? Choisissez l\'application adaptée à votre plateforme.',
            'meta_description' => 'Partagez des recettes, suivez votre santé intestinale et découvrez des repas délicieux avec GutUp. Téléchargez l\'application maintenant !',
            'badge_alt_google_play' => 'Disponible sur Google Play',
            'badge_alt_app_store' => 'Télécharger dans l\'App Store',
        ],
    ];

    return $translations[$lang] ?? $translations['en'];
}
?>
