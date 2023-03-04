<?php

declare(strict_types=1);

namespace app\models\db;

use app\models\settings\{AntragsgruenApp, Site as SiteSettings, UserGroupPermissions};
use yii\db\{ActiveQuery, ActiveRecord};

/**
 * @property int|null $id
 * @property string|null $externalId
 * @property int|null $templateId
 * @property string $title
 * @property int|null $consultationId
 * @property int|null $siteId
 * @property int $position
 * @property int $selectable
 * @property string $permissions
 *
 * @property Consultation|null $consultation
 * @property Site|null $site
 * @property User[] $users
 */
class ConsultationUserGroup extends ActiveRecord
{
    public const TEMPLATE_SITE_ADMIN = 1;
    public const TEMPLATE_CONSULTATION_ADMIN = 2;
    public const TEMPLATE_PROPOSED_PROCEDURE = 3;
    public const TEMPLATE_PARTICIPANT = 4;

    public static function tableName(): string
    {
        return AntragsgruenApp::getInstance()->tablePrefix . 'consultationUserGroup';
    }

    public function getConsultation(): ActiveQuery
    {
        return $this->hasOne(Consultation::class, ['id' => 'consultationId']);
    }

    public function getSite(): ActiveQuery
    {
        return $this->hasOne(Site::class, ['id' => 'siteId']);
    }

    public function getUsers(): ActiveQuery
    {
        return $this->hasMany(User::class, ['id' => 'userId'])->viaTable('userGroup', ['groupId' => 'id'])
            ->andWhere(User::tableName() . '.status != ' . User::STATUS_DELETED);
    }

    public static function consultationHasLoadableUserGroups(Consultation $consultation): bool
    {
        return in_array(SiteSettings::LOGIN_GRUENES_NETZ, $consultation->site->getSettings()->loginMethods);
    }

    /**
     * @return ConsultationUserGroup[]
     */
    public static function findBySearchQuery(Consultation $consultation, string $queryString): array
    {
        if (!self::consultationHasLoadableUserGroups($consultation)) {
            return [];
        }

        $allowedExternalPatterns = ['or'];
        if (in_array(SiteSettings::LOGIN_GRUENES_NETZ, $consultation->site->getSettings()->loginMethods)) {
            $allowedExternalPatterns[] = ['like', 'externalId', 'gruenesnetz:%', false];
        }

        /** @var ConsultationUserGroup[] $groups */
        $groups = ConsultationUserGroup::find()
            ->where([
                'and',
                ['siteId' => null],
                $allowedExternalPatterns,
                ['like', 'title', explode(" ", $queryString)],
            ])
            ->orderBy('title')
            ->limit(100)
            ->all();

        return array_values(array_filter($groups, function (ConsultationUserGroup $group) use ($consultation): bool {
            return $group->mayBeUsedForConsultation($consultation);
        }));
    }

    public static function findByConsultation(Consultation $consultation, array $additionalIds = []): array
    {
        /** @var ConsultationUserGroup[] $groups */
        $groups = ConsultationUserGroup::find()
            ->where([
                'or',
                ['siteId' => $consultation->siteId],
                ['consultationId' => $consultation->id],
                ['in', 'id', $additionalIds],
            ])
            ->all();

        return array_values(array_filter($groups, function (ConsultationUserGroup $group) use ($consultation): bool {
            return $group->mayBeUsedForConsultation($consultation);
        }));
    }

    public static function findByExternalId(string $externalId): ?ConsultationUserGroup
    {
        return ConsultationUserGroup::findOne(['externalId' => $externalId]);
    }

    public static function loadGroupsByIdForConsultation(Consultation $consultation, array $groupIds): array
    {
        $groups = [];
        foreach ($groupIds as $groupId) {
            $group = ConsultationUserGroup::findOne(intval($groupId));
            if ($group && $group->mayBeUsedForConsultation($consultation)) {
                $groups[] = $group;
            }
        }
        return $groups;
    }

    // Hint: this method can be used if the group assignment of all users need to be evaluated in a call.
    // Iterating over the userIds attached to a user group is faster than over the groupIds of a user,
    // as there are way more users, and we would need to perform more queries that way.
    // Note that this method should only be used for read-only operations, as the cache is not flushed yet.
    /** @var null|int[][] */
    private static ?array $userIdCache = [];

    public function getUserIds(): array
    {
        if (!isset(self::$userIdCache[$this->id])) {
            $tableName = AntragsgruenApp::getInstance()->tablePrefix . 'userGroup';
            $rows = (new \yii\db\Query())
                ->select(['userId'])
                ->from($tableName)
                ->where(['groupId' => $this->id])
                ->all();
            self::$userIdCache[$this->id] = [];
            foreach ($rows as $row) {
                self::$userIdCache[$this->id][] = intval($row['userId']);
            }
        }
        return self::$userIdCache[$this->id];
    }

    /**
     * @return User[]
     */
    public function getUsersCached(): array
    {
        $users = [];
        foreach ($this->getUserIds() as $userId) {
            $users[] = User::getCachedUser($userId);
        }
        return $users;
    }

    public function getGroupPermissions(): UserGroupPermissions
    {
        return UserGroupPermissions::fromDatabaseString($this->permissions, $this->consultationId === null);
    }

    public function setGroupPermissions(UserGroupPermissions $permissions): void
    {
        $this->permissions = $permissions->toDatabaseString();
    }

    public function getNormalizedTitle(): string
    {
        switch ($this->templateId) {
            case static::TEMPLATE_SITE_ADMIN:
                return \Yii::t('user', 'group_template_siteadmin');
            case static::TEMPLATE_CONSULTATION_ADMIN:
                return \Yii::t('user', 'group_template_consultationadmin');
            case static::TEMPLATE_PROPOSED_PROCEDURE:
                return \Yii::t('user', 'group_template_proposed');
            case static::TEMPLATE_PARTICIPANT:
                return \Yii::t('user', 'group_template_participant');
            default:
                return $this->title;
        }
    }

    public function getNormalizedDescription(): ?string
    {
        switch ($this->templateId) {
            case static::TEMPLATE_SITE_ADMIN:
                return \Yii::t('user', 'group_template_siteadmin_h');
            case static::TEMPLATE_CONSULTATION_ADMIN:
                return \Yii::t('user', 'group_template_consultationadmin_h');
            case static::TEMPLATE_PROPOSED_PROCEDURE:
                return \Yii::t('user', 'group_template_proposed_h');
            case static::TEMPLATE_PARTICIPANT:
                return \Yii::t('user', 'group_template_participant_h');
            default:
                return null;
        }
    }

    public function addUser(User $user): void
    {
        $this->link('users', $user);
    }

    public function hasUser(User $user): bool
    {
        foreach ($this->users as $_user) {
            if ($user->id === $_user->id) {
                return true;
            }
        }
        return false;
    }

    public function getAuthType(): int
    {
        if ($this->externalId === null) {
            return SiteSettings::LOGIN_STD;
        }
        $authparts = explode(':', $this->externalId);
        if (preg_match('/^openslides-/siu', $authparts[0])) {
            return SiteSettings::LOGIN_OPENSLIDES;
        }
        return SiteSettings::LOGIN_STD;
    }

    public function getVotingApiObject(?int $overwriteUserCount = null): array
    {
        return [
            'id' => $this->id,
            'title' => $this->getNormalizedTitle(),
            'member_count' => $overwriteUserCount ?? count($this->getUserIds()),
        ];
    }

    public function getUserAdminApiObject(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->getNormalizedTitle(),
            'description' => $this->getNormalizedDescription(),
            'editable' => $this->isUserEditable(),
            'permissions' => $this->getGroupPermissions()->toApi($this->consultation),
            'auth_type' => $this->getAuthType(),
        ];
    }

    public function isSpecificallyRelevantForConsultationOrSite(Consultation $consultation): bool
    {
        if ($this->consultationId) {
            return ($this->consultationId === $consultation->id);
        } else {
            return $this->siteId === $consultation->siteId;
        }
    }

    public function isUserEditable(): bool
    {
        // Automatic template-based user groups and system-wide groups may not be deleted by users
        return $this->templateId === null && ($this->siteId !== null || $this->consultationId !== null);
    }

    public function belongsToExternalAuth(string $authPrefix): bool
    {
        return $this->externalId && (stripos($this->externalId, $authPrefix . ':') === 0);
    }

    public function mayBeUsedForConsultation(Consultation $consultation): bool
    {
        if ($this->consultationId !== null) {
            return $this->consultationId === $consultation->id;
        } elseif ($this->siteId !== null) {
            return $this->siteId === $consultation->siteId;
        } else {
            if ($this->belongsToExternalAuth('gruenesnetz')) {
                return in_array(SiteSettings::LOGIN_GRUENES_NETZ, $consultation->site->getSettings()->loginMethods);
            }
        }

        return false;
    }

    public static function createDefaultGroupSiteAdmin(Site $site): self
    {
        $group = new ConsultationUserGroup();
        $group->siteId = $site->id;
        $group->consultationId = null;
        $group->externalId = null;
        $group->templateId = static::TEMPLATE_SITE_ADMIN;
        $group->title = \Yii::t('user', 'group_template_siteadmin');
        $group->setGroupPermissions(UserGroupPermissions::fromDatabaseString(UserGroupPermissions::PERMISSION_ADMIN_ALL, true));
        $group->selectable = 1;
        $group->save();

        return $group;
    }

    public static function createDefaultGroupConsultationAdmin(Consultation $consultation): self
    {
        $group = new ConsultationUserGroup();
        $group->siteId = $consultation->siteId;
        $group->consultationId = $consultation->id;
        $group->externalId = null;
        $group->templateId = static::TEMPLATE_CONSULTATION_ADMIN;
        $group->title = \Yii::t('user', 'group_template_consultationadmin');
        $group->setGroupPermissions(UserGroupPermissions::fromDatabaseString(UserGroupPermissions::PERMISSION_ADMIN_ALL, false));
        $group->selectable = 1;
        $group->save();

        return $group;
    }

    public static function createDefaultGroupProposedProcedure(Consultation $consultation): self
    {
        $group = new ConsultationUserGroup();
        $group->siteId = $consultation->siteId;
        $group->consultationId = $consultation->id;
        $group->externalId = null;
        $group->templateId = static::TEMPLATE_PROPOSED_PROCEDURE;
        $group->title = \Yii::t('user', 'group_template_proposed');
        $group->setGroupPermissions(UserGroupPermissions::fromDatabaseString(UserGroupPermissions::PERMISSION_PROPOSED_PROCEDURE, false));
        $group->selectable = 1;
        $group->save();

        return $group;
    }

    public static function createDefaultGroupParticipant(Consultation $consultation): self
    {
        $group = new ConsultationUserGroup();
        $group->siteId = $consultation->siteId;
        $group->consultationId = $consultation->id;
        $group->externalId = null;
        $group->templateId = static::TEMPLATE_PARTICIPANT;
        $group->title = \Yii::t('user', 'group_template_participant');
        $group->setGroupPermissions(UserGroupPermissions::fromDatabaseString(null, false));
        $group->selectable = 1;
        $group->save();

        return $group;
    }
}
