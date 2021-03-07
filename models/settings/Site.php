<?php

namespace app\models\settings;

class Site implements \JsonSerializable
{
    use JsonConfigTrait;

    /** @var string */
    public $siteLayout = 'layout-classic';

    /** @var bool */
    public $showAntragsgruenAd = true;
    public $showBreadcrumbs = true;
    public $apiEnabled = false;

    /** @var int[] */
    public $loginMethods = [
        self::LOGIN_STD,
        self::LOGIN_GRUENES_NETZ,
        self::LOGIN_EXTERNAL,
    ];

    /** @var array */
    public $stylesheetSettings = [];
    public $apiCorsOrigins = [];

    const LOGIN_STD = 0;
    const LOGIN_GRUENES_NETZ = 1;
    const LOGIN_EXTERNAL = 3;
    const LOGIN_SAML = 4;

    public static $SITE_MANAGER_LOGIN_METHODS = [
        self::LOGIN_STD,
        self::LOGIN_GRUENES_NETZ,
        self::LOGIN_EXTERNAL,
    ];

    public function getStylesheet(): Stylesheet
    {
        return new Stylesheet($this->stylesheetSettings);
    }

    public function setStylesheet(Stylesheet $stylesheet): void
    {
        $this->stylesheetSettings = $stylesheet->jsonSerialize();
    }
}
