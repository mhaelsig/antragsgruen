<?php

use app\components\HTMLTools;
use app\models\db\{ConsultationMotionType, ConsultationUserGroup};
use app\models\policies\IPolicy;
use app\models\supportTypes\SupportBase;
use yii\helpers\Html;

/**
 * @var Yii\web\View $this
 * @var ConsultationMotionType $motionType
 */

$policies = [];
foreach (IPolicy::getPolicies() as $policy) {
    $policies[$policy::getPolicyID()] = $policy::getPolicyName();
}

$printUserGroupSelector = function (string $id, string $formName, ConsultationMotionType $motionType, IPolicy $currentPolicy) {
    if (ConsultationUserGroup::consultationHasLoadableUserGroups($motionType->getConsultation())) {
        $groupLoadUrl = \app\components\UrlHelper::createUrl('/admin/users/search-groups');
    } else {
        $groupLoadUrl = '';
    }
    if (is_a($currentPolicy, \app\models\policies\UserGroups::class)) {
        $preselectedUserGroupsIds = array_map(function (ConsultationUserGroup $group): int { return $group->id; }, $currentPolicy->getAllowedUserGroups());
    } else {
        $preselectedUserGroupsIds = [];
    }
    ?>
    <div class="userGroupSelect" data-load-url="<?= Html::encode($groupLoadUrl) ?>">
        <select id="<?= $id ?>" name="type[<?= $formName ?>][groups][]" multiple
                placeholder="<?= Yii::t('admin', 'motion_type_group_ph') ?>" title="<?= Yii::t('admin', 'motion_type_group_title') ?>">
            <?php
            foreach ($motionType->getConsultation()->getAllAvailableUserGroups($preselectedUserGroupsIds) as $group) {
                echo '<option value="' . $group->id . '"';
                if (is_a($currentPolicy, \app\models\policies\UserGroups::class) && $currentPolicy->allowsUserGroup($group)) {
                    echo ' selected';
                }
                echo '>';
                echo Html::encode($group->getNormalizedTitle());
                echo '</option>';
            }
            ?>
        </select>
    </div>
    <?php
}

?>
<h2 class="h3"><?= Yii::t('admin', 'motion_type_perm') ?></h2>

<!-- Policy for creating motions -->

<div class="stdTwoCols hideForAmendmentsOnly">
    <label class="leftColumn" for="typePolicyMotions">
        <?= Yii::t('admin', 'motion_type_perm_motion') ?>:
    </label>
    <div class="rightColumn policyWidget policyWidgetMotions">
        <?php
        $currentPolicy = $motionType->getMotionPolicy();
        echo Html::dropDownList(
            'type[policyMotions][id]',
            $currentPolicy::getPolicyID(),
            $policies,
            ['id' => 'typePolicyMotions', 'class' => 'stdDropdown policySelect']
        );
        $printUserGroupSelector('typePolicyMotionsGroups', 'policyMotions', $motionType, $currentPolicy);
        ?>
    </div>
</div>

<!--Support policy for motions -->


<div class="stdTwoCols hideForAmendmentsOnly">
    <label class="leftColumn" for="typePolicySupportMotions">
        <?= Yii::t('admin', 'motion_type_perm_supp_mot') ?>:
    </label>
    <div class="rightColumn policyWidget policyWidgetSupportMotions">
        <?php
        $currentPolicy = $motionType->getMotionSupportPolicy();
        echo Html::dropDownList(
            'type[policySupportMotions][id]',
            $currentPolicy::getPolicyID(),
            $policies,
            ['id' => 'typePolicySupportMotions', 'class' => 'stdDropdown policySelect']
        );
        $printUserGroupSelector('typePolicySupportMotionsGroups', 'policySupportMotions', $motionType, $currentPolicy);
        ?>
    </div>
</div>


<!--Support types for motions (Likes, Dislikes, Official support) -->

<div class="stdTwoCols hideForAmendmentsOnly">
    <div class="leftColumn"></div>
    <div class="rightColumn">
        <fieldset class="contactDetails motionSupportPolicy">
            <legend class="sr-only"><?= Yii::t('admin', 'motion_type_like_title') ?></legend>
            <?php
            $checkboxes = [
                [SupportBase::LIKEDISLIKE_LIKE, Yii::t('admin', 'motion_type_like_like'), 'motionLike'],
                [SupportBase::LIKEDISLIKE_DISLIKE, Yii::t('admin', 'motion_type_like_dislike'), 'motionDislike'],
                [SupportBase::LIKEDISLIKE_SUPPORT, Yii::t('admin', 'motion_type_like_support'), 'motionSupport'],
            ];
            foreach ($checkboxes as $checkbox) {
                echo '<label>';
                echo Html::checkbox(
                    'type[motionLikesDislikes][]',
                    ($motionType->motionLikesDislikes & $checkbox[0]),
                    ['value' => $checkbox[0], 'class' => $checkbox[2]]
                );
                echo $checkbox[1];

                if ($checkbox[0] === SupportBase::LIKEDISLIKE_LIKE) {
                    echo HTMLTools::getTooltipIcon(Yii::t('admin', 'motion_type_like_like_h'));
                }
                if ($checkbox[0] === SupportBase::LIKEDISLIKE_SUPPORT) {
                    echo HTMLTools::getTooltipIcon(Yii::t('admin', 'motion_type_like_support_h'));
                }

                echo '</label>';
            }
            ?>
        </fieldset>
    </div>
</div>


<!-- Policy for creating amendments -->

<div class="stdTwoCols">
    <label class="leftColumn" for="typePolicyAmendments">
        <?= Yii::t('admin', 'motion_type_perm_amend') ?>:
    </label>
    <div class="rightColumn policyWidget policyWidgetAmendments">
        <?php
        $currentPolicy = $motionType->getAmendmentPolicy();
        echo Html::dropDownList(
            'type[policyAmendments][id]',
            $currentPolicy::getPolicyID(),
            $policies,
            ['id' => 'typePolicyAmendments', 'class' => 'stdDropdown policySelect']
        );
        $printUserGroupSelector('typePolicyAmendmentsGroups', 'policyAmendments', $motionType, $currentPolicy);
        ?>
    </div>
</div>
<div class="stdTwoCols checkboxNoPadding">
    <div class="leftColumn"></div>
    <div class="rightColumn">
        <?php
        echo HTMLTools::labeledCheckbox(
            'type[amendSinglePara]',
            Yii::t('admin', 'motion_type_amend_singlep'),
            ($motionType->amendmentMultipleParagraphs !== ConsultationMotionType::AMEND_PARAGRAPHS_MULTIPLE),
            'typeAmendSinglePara'
        );
        echo '<br>';
        echo HTMLTools::labeledCheckbox(
            'type[typeAmendSingleChange]',
            Yii::t('admin', 'motion_type_amend_singlec'),
            ($motionType->amendmentMultipleParagraphs === ConsultationMotionType::AMEND_PARAGRAPHS_SINGLE_CHANGE),
            'typeAmendSingleChange',
            Yii::t('admin', 'motion_type_amend_singlech')
        );
        ?>
    </div>
</div>
<div class="stdTwoCols checkboxNoPadding">
    <div class="leftColumn"></div>
    <div class="rightColumn">
        <?php
        echo HTMLTools::labeledCheckbox(
            'type[allowAmendmentsToAmendments]',
            Yii::t('admin', 'motion_type_allow_amend_amend'),
            $motionType->getSettingsObj()->allowAmendmentsToAmendments,
            'allowAmendmentsToAmendments'
        );
        ?>
    </div>
</div>


<!-- Support policy for amendments -->

<div class="stdTwoCols">
    <label class="leftColumn" for="typePolicySupportAmendments">
        <?= Yii::t('admin', 'motion_type_perm_supp_amend') ?>:
    </label>
    <div class="rightColumn policyWidget policyWidgetSupportAmendments">
        <?php
        $currentPolicy = $motionType->getAmendmentSupportPolicy();
        echo Html::dropDownList(
            'type[policySupportAmendments][id]',
            $currentPolicy::getPolicyID(),
            $policies,
            ['id' => 'typePolicySupportAmendments', 'class' => 'stdDropdown policySelect']
        );
        $printUserGroupSelector('typePolicySupportAmendmentsGroups', 'policySupportAmendments', $motionType, $currentPolicy);
        ?>
    </div>
</div>


<!-- Support types for amendments (Likes, Dislikes, Official support) -->

<div class="stdTwoCols">
    <div class="leftColumn"></div>
    <div class="rightColumn">
        <fieldset class="contactDetails amendmentSupportPolicy">
            <legend class="sr-only"><?= Yii::t('admin', 'motion_type_like_title') ?></legend>
            <?php
            $checkboxes = [
                [SupportBase::LIKEDISLIKE_LIKE, Yii::t('admin', 'motion_type_like_like'), 'amendmentLike'],
                [SupportBase::LIKEDISLIKE_DISLIKE, Yii::t('admin', 'motion_type_like_dislike'), 'amendmentDislike'],
                [SupportBase::LIKEDISLIKE_SUPPORT, Yii::t('admin', 'motion_type_like_support'), 'amendmentSupport'],
            ];
            foreach ($checkboxes as $checkbox) {
                echo '<label>';
                echo Html::checkbox(
                    'type[amendmentLikesDislikes][]',
                    ($motionType->amendmentLikesDislikes & $checkbox[0]),
                    ['value' => $checkbox[0], 'class' => $checkbox[2]]
                );

                echo $checkbox[1];

                if ($checkbox[0] === SupportBase::LIKEDISLIKE_LIKE) {
                    echo HTMLTools::getTooltipIcon(Yii::t('admin', 'motion_type_like_like_h'));
                }
                if ($checkbox[0] === SupportBase::LIKEDISLIKE_SUPPORT) {
                    echo HTMLTools::getTooltipIcon(Yii::t('admin', 'motion_type_like_support_h'));
                }

                echo '</label>';
            }
            ?>
        </fieldset>
    </div>
</div>


<!--Policy for creating comments -->

<div class="stdTwoCols">
    <label class="leftColumn" for="typePolicyComments">
        <?= Yii::t('admin', 'motion_type_perm_comment') ?>:
    </label>
    <div class="rightColumn policyWidget policyWidgetComments">
        <?php
        $currentPolicy = $motionType->getCommentPolicy();
        echo Html::dropDownList(
            'type[policyComments][id]',
            $currentPolicy::getPolicyID(),
            $policies,
            ['id' => 'typePolicyComments', 'class' => 'stdDropdown policySelect']
        );
        $printUserGroupSelector('typePolicyCommentsGroups', 'policyComments', $motionType, $currentPolicy);
        ?>
    </div>
</div>

<div class="stdTwoCols checkboxNoPadding">
    <div class="leftColumn"></div>
    <div class="rightColumn">
        <?php
        echo HTMLTools::labeledCheckbox(
            'type[commentsRestrictViewToWritables]',
            Yii::t('admin', 'motion_type_perm_comment_restrict'),
            $motionType->getSettingsObj()->commentsRestrictViewToWritables,
            'commentsRestrictViewToWritables'
        );
        ?>
    </div>
</div>


<!-- Are initiators allowed to merge amendments into their motions -->

<div class="stdTwoCols initiatorsCanMergeRow hideForAmendmentsOnly">
    <div class="leftColumn">
        <?= Yii::t('admin', 'motion_type_initiators_merge') ?>:
    </div>
    <div class="rightColumn">
        <fieldset>
            <legend class="hidden"><?= Yii::t('admin', 'motion_type_initiators_merge') ?></legend>
            <label><?php
                echo Html::radio(
                    'type[initiatorsCanMergeAmendments]',
                    ($motionType->initiatorsCanMergeAmendments == ConsultationMotionType::INITIATORS_MERGE_NEVER),
                    [
                        'value' => ConsultationMotionType::INITIATORS_MERGE_NEVER,
                        'id' => 'initiatorsCanMerge' . ConsultationMotionType::INITIATORS_MERGE_NEVER,
                    ]
                );
                ?> <?= Yii::t('admin', 'motion_type_initiators_merge_no') ?>
            </label>
            <label><?php
                echo Html::radio(
                    'type[initiatorsCanMergeAmendments]',
                    ($motionType->initiatorsCanMergeAmendments == ConsultationMotionType::INITIATORS_MERGE_NO_COLLISION),
                    [
                        'value' => ConsultationMotionType::INITIATORS_MERGE_NO_COLLISION,
                        'id' => 'initiatorsCanMerge' . ConsultationMotionType::INITIATORS_MERGE_NO_COLLISION,
                    ]
                );
                ?> <?= Yii::t('admin', 'motion_type_initiators_merge_nocoll') ?>
                <?= HTMLTools::getTooltipIcon(Yii::t('admin', 'motion_type_initiators_merge_nocoll_hint')) ?>
            </label>
            <label><?php
                echo Html::radio(
                    'type[initiatorsCanMergeAmendments]',
                    ($motionType->initiatorsCanMergeAmendments == ConsultationMotionType::INITIATORS_MERGE_WITH_COLLISION),
                    [
                        'value' => ConsultationMotionType::INITIATORS_MERGE_WITH_COLLISION,
                        'id' => 'initiatorsCanMerge' . ConsultationMotionType::INITIATORS_MERGE_WITH_COLLISION,
                    ]
                )
                ?> <?= Yii::t('admin', 'motion_type_initiators_merge_yes') ?>
                <?= HTMLTools::getTooltipIcon(Yii::t('admin', 'motion_type_initiators_merge_yes_hint')) ?>
            </label>
        </fieldset>
    </div>
</div>

<?php
?>
