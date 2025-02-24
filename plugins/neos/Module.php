<?php

namespace app\plugins\neos;

use app\components\RequestContext;
use app\controllers\Base;
use app\models\http\HtmlResponse;
use app\models\db\{Consultation, Site};
use app\models\settings\Layout;
use app\plugins\ModuleBase;
use yii\web\View;

class Module extends ModuleBase
{
    public function init(): void
    {
        parent::init();
    }

    public static function getProvidedLayouts(?View $view = null): array
    {
        if ($view) {
            $asset     = ThumbnailAssets::register($view);
            $thumbBase = $asset->baseUrl;
        } else {
            $thumbBase = '/';
        }

        return [
            'std' => [
                'title'   => 'NEOS',
                'preview' => $thumbBase . '/layout-preview-neos.png',
                'bundle'  => Assets::class,
            ]
        ];
    }

    public static function overridesDefaultLayout(): string
    {
        return 'layout-plugin-neos-std';
    }

    /**
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public static function getConsultationSettingsClass(Consultation $consultation): string
    {
        return ConsultationSettings::class;
    }

    public static function getForcedLayoutHooks(Layout $layoutSettings, ?Consultation $consultation): array
    {
        return [
            new LayoutHooks($layoutSettings, $consultation)
        ];
    }

    public static function getProvidedTranslations(): array
    {
        return ['de'];
    }

    public static function getDefaultLogo(): array
    {
        return [
            'image/png',
            \Yii::$app->basePath . '/plugins/neos/assets/neos-antragsschmiede.png'
        ];
    }

    public static function hasSiteHomePage(): bool
    {
        return true;
    }

    public static function getSiteHomePage(): ?HtmlResponse
    {
        return new HtmlResponse(RequestContext::getController()->renderContentPage('MV-Seiten'));
    }

    public static function preferConsultationSpecificHomeLink(): bool
    {
        return true;
    }

    public static function siteHomeIsAlwaysPublic(): bool
    {
        return true;
    }
}
