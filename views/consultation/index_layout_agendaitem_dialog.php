<?php

/**
 * @var \app\models\db\Consultation $consultation
 */
use app\models\policies\IPolicy;
use yii\helpers\Html;

$types = '<option value=""> - keine -</option>';
foreach ($consultation->motionTypes as $motionType) {
    $types .= '<option value="' . $motionType->id . '">' . Html::encode($motionType->title) . '</option>';
}

$policies = '';
foreach (IPolicy::getPolicies() as $policy) {
    $policies .= '<option value="' . $policy::getPolicyID() . '">';
    $policies .= Html::encode($policy::getPolicyName()) . '</option>';
}
?>

<div class="modal fade" id="msettDialog">
    <div class="modal-dialog">
        <form class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4 class="modal-title">Anträge zu diesem Tagesordnungspunkt</h4>
            </div>
            <div class="modal-body">
                <div class="form-horizontal">
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="motionSettingsType">Anträge:</label>

                        <div class="col-md-8">
                            <select class="form-control" id="motionSettingsType" name="motionType">
                                <?= $types ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="msettPolicyMotion">Antragsberechtigt:</label>

                        <div class="col-md-8">
                            <select class="form-control" id="msettPolicyMotion" name="policyMotion">
                                <?= $policies ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="msettPolicyAmendment">ÄA-Berechtigt:</label>

                        <div class="col-md-8">
                            <select class="form-control" id="msettPolicyAmendment" name="policyAmendment">
                                <?= $policies ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="msettPolicyComment">Kommentarberechtigt:</label>

                        <div class="col-md-8">
                            <select class="form-control" id="msettPolicyComment" name="policyComment">
                                <?= $policies ?>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Schließen</button>
                <button type="button" class="btn btn-primary">Setzen</button>
            </div>
        </form>
    </div>
</div>
