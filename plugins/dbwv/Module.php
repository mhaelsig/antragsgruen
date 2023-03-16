<?php

declare(strict_types=1);

namespace app\plugins\dbwv;

use app\models\db\Consultation;
use app\models\settings\Layout;
use app\plugins\dbwv\workflow\Workflow;
use app\plugins\ModuleBase;

class Module extends ModuleBase
{
    public static function getProvidedTranslations(): array
    {
        return ['de'];
    }

    public static function getForcedLayoutHooks(Layout $layoutSettings, ?Consultation $consultation): array
    {
        return [
            new LayoutHooks($layoutSettings, $consultation)
        ];
    }

    public static function getDefaultLogo(): array
    {
        return [
            'image/png',
            \Yii::$app->basePath . '/plugins/dbwv/assets/dbwv-logo.png'
        ];
    }

    public static function getMotionVersions(Consultation $consultation): ?array
    {
        return [
            (string)Workflow::STEP_V1 => Workflow::STEP_NAME_V1,
            (string)Workflow::STEP_V2 => Workflow::STEP_NAME_V2,
            (string)Workflow::STEP_V3 => Workflow::STEP_NAME_V3,
            (string)Workflow::STEP_V4 => Workflow::STEP_NAME_V4,
            (string)Workflow::STEP_V5 => Workflow::STEP_NAME_V5,
            (string)Workflow::STEP_V6 => Workflow::STEP_NAME_V6,
            (string)Workflow::STEP_V7 => Workflow::STEP_NAME_V7,
            (string)Workflow::STEP_V8 => Workflow::STEP_NAME_V8,
        ];
    }
}
