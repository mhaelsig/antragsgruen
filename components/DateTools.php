<?php

namespace app\components;

use app\models\db\{Consultation, User};

class DateTools
{
    public static function isDeadlineDebugModeActive(?Consultation $consultation = null): bool
    {
        if (!$consultation || !User::havePrivilege($consultation, User::PRIVILEGE_CONSULTATION_SETTINGS)) {
            return false;
        }
        return (\Yii::$app->session->get('deadline_debug_mode', null) === '1');
    }

    public static function setDeadlineDebugMode(?Consultation $consultation, bool $active): void
    {
        if ($consultation && User::havePrivilege($consultation, User::PRIVILEGE_CONSULTATION_SETTINGS)) {
            if ($active) {
                \Yii::$app->session->set('deadline_debug_mode', '1');
            } else {
                \Yii::$app->session->remove('deadline_debug_mode');
                \Yii::$app->session->remove('deadline_simulate_time');
            }
        }
    }

    public static function setDeadlineTime(?Consultation $consultation, ?string $time): void
    {
        if ($consultation && User::havePrivilege($consultation, User::PRIVILEGE_CONSULTATION_SETTINGS)) {
            if ($time) {
                \Yii::$app->session->set('deadline_simulate_time', $time);
            } else {
                \Yii::$app->session->remove('deadline_simulate_time');
            }
        }
    }

    public static function formatDeadlineRange(array $deadline, bool $allowRelativeDates = true): string
    {
        if ($deadline['start'] && $deadline['end']) {
            $start = Tools::formatMysqlDateTime($deadline['start'], null, $allowRelativeDates);
            $end   = Tools::formatMysqlDateTime($deadline['end'], null, $allowRelativeDates);
            return str_replace(['%from%', '%to%'], [$start, $end], \Yii::t('structure', 'policy_deadline_from_to'));
        } elseif ($deadline['start']) {
            $start = Tools::formatMysqlDateTime($deadline['start'], null, $allowRelativeDates);
            return str_replace('%from%', $start, \Yii::t('structure', 'policy_deadline_from'));
        } elseif ($deadline['end']) {
            $end   = Tools::formatMysqlDateTime($deadline['end'], null, $allowRelativeDates);
            return str_replace('%to%', $end, \Yii::t('structure', 'policy_deadline_to'));
        } else {
            return \Yii::t('structure', 'policy_deadline_na');
        }
    }

    public static function formatDeadlineRanges(array $deadlines, bool $allowRelativeDates = true): string
    {
        $formatted = [];
        foreach ($deadlines as $deadline) {
            $formatted[] = static::formatDeadlineRange($deadline, $allowRelativeDates);
        }
        return implode(', ', $formatted);
    }

    public static function getSimulatedTime(?Consultation $consultation): ?string
    {
        if (!$consultation || !User::havePrivilege($consultation, User::PRIVILEGE_CONSULTATION_SETTINGS)) {
            return null;
        }
        $time = \Yii::$app->session->get('deadline_simulate_time');
        return ($time ? $time : null);
    }

    public static function getCurrentTimestamp(): int
    {
        $consultation = UrlHelper::getCurrentConsultation();
        if (!$consultation || !User::havePrivilege($consultation, User::PRIVILEGE_CONSULTATION_SETTINGS)) {
            return time();
        }
        if (\Yii::$app->session->get('deadline_debug_mode', null) !== '1') {
            return time();
        }
        $time = \Yii::$app->session->get('deadline_simulate_time');
        if ($time) {
            return Tools::dateSql2timestamp($time);
        } else {
            return time();
        }
    }
}
