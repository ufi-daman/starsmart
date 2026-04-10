<?php
/**
 * Plugin Name: StarSmart Deploy Webhook
 * Description: Po uložení ACF polí na hlavní stránce spustí Astro rebuild přes GitHub Actions.
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Spustí GitHub Actions workflow_dispatch při uložení ACF polí.
 */
function starsmart_trigger_rebuild(int $post_id): void {
    // Pouze pro hlavní stránku
    if (get_post_field('post_name', $post_id) !== 'hlavni-stranka') return;
    // Zabránit smyčce při auto-save
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;

    $token = defined('STARSMART_GH_TOKEN') ? STARSMART_GH_TOKEN : get_option('starsmart_gh_token');
    $repo  = defined('STARSMART_GH_REPO')  ? STARSMART_GH_REPO  : get_option('starsmart_gh_repo');

    if (!$token || !$repo) return;

    wp_remote_post(
        "https://api.github.com/repos/{$repo}/dispatches",
        [
            'headers' => [
                'Authorization' => "Bearer {$token}",
                'Accept'        => 'application/vnd.github+json',
                'Content-Type'  => 'application/json',
            ],
            'body'    => wp_json_encode(['event_type' => 'wp-content-updated']),
            'timeout' => 10,
        ]
    );
}
add_action('acf/save_post', 'starsmart_trigger_rebuild', 20);

/**
 * Nastavovací stránka v adminu.
 */
function starsmart_settings_page(): void {
    add_options_page('StarSmart Deploy', 'StarSmart Deploy', 'manage_options', 'starsmart-deploy', function () {
        if ($_POST) {
            update_option('starsmart_gh_token', sanitize_text_field($_POST['gh_token'] ?? ''));
            update_option('starsmart_gh_repo',  sanitize_text_field($_POST['gh_repo']  ?? ''));
            echo '<div class="updated"><p>Uloženo.</p></div>';
        }
        $token = esc_attr(get_option('starsmart_gh_token'));
        $repo  = esc_attr(get_option('starsmart_gh_repo'));
        echo "<div class='wrap'><h1>StarSmart Deploy Webhook</h1>
        <form method='post'>
          <table class='form-table'>
            <tr><th>GitHub Token</th><td><input name='gh_token' value='{$token}' class='regular-text' type='password'></td></tr>
            <tr><th>GitHub Repo (owner/repo)</th><td><input name='gh_repo' value='{$repo}' class='regular-text' placeholder='uzivatel/starsmart'></td></tr>
          </table>
          " . wp_nonce_field('starsmart_save') . "
          <button class='button button-primary'>Uložit</button>
        </form></div>";
    });
}
add_action('admin_menu', 'starsmart_settings_page');
