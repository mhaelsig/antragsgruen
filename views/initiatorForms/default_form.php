<?php

use app\models\db\Consultation;
use app\models\db\ISupporter;
use yii\helpers\Html;

/**
 * @var \yii\web\View $this
 * @var Consultation $consultation
 * @var ISupporter $initiator
 * @var ISupporter[] $supporters
 * @var bool $allowOther
 * @var bool $hasSupporters
 * @var bool $minSupporters
 * @var bool $supporterFulltext
 * @var bool $supporterOrga
 */

/** @var app\controllers\Base $controller */
$controller = $this->context;

$settings = $consultation->getSettings();

echo '<fieldset class="supporterForm supporterFormStd">';

echo '<h2 class="green">' . 'AntragstellerIn' . '</h2>';

$preOrga       = Html::encode($initiator->organization);
$preName       = Html::encode($initiator->name);
$preEmail      = Html::encode($initiator->contactEmail);
$prePhone      = Html::encode($initiator->contactPhone);
$preResolution = Html::encode($initiator->resolutionDate);
echo '<div class="initiatorData form-horizontal content">';

if ($allowOther) {
    echo '<div class="checkbox"><label><input type="checkbox" name="andere_antragstellerIn"> ' .
        'Ich lege diesen Antrag für eine andere AntragstellerIn an <small>(Admin-Funktion)</small>
    </label></div>';
}

echo '<div class="form-group">
<label class="col-sm-3 control-label">Ich bin eine...</label>
<div class="col-sm-9">
<label class="radio-inline">';
echo Html::radio(
    'Initiator[personType]',
    $initiator->personType == ISupporter::PERSON_NATURAL,
    [
        'value' => ISupporter::PERSON_NATURAL,
        'id'    => 'personTypeNatural',
    ]
);
echo ' Natürliche Person
</label>
<label class="radio-inline">';
echo Html::radio(
    'Initiator[personType]',
    $initiator->personType == ISupporter::PERSON_ORGANIZATION,
    [
        'value' => ISupporter::PERSON_ORGANIZATION,
        'id'    => 'personTypeOrga',
    ]
);

echo ' Organisation / Gremium
</label>
</div>
</div>

<div class="form-group">
  <label class="col-sm-3 control-label" for="initiatorName">' . Yii::t('initiator', 'Name') . '</label>
  <div class="col-sm-4">
    <input type="text" class="form-control" id="initiatorName" name="Initiator[name]" value="' . $preName . '" required>
  </div>
</div>

<div class="form-group organizationRow">
  <label class="col-sm-3 control-label" for="initiatorOrga">' . Yii::t('initiator', 'Gremium, LAG...') . '</label>
  <div class="col-sm-4">
    <input type="text" class="form-control" id="initiatorOrga" name="Initiator[organization]" value="' . $preOrga . '">
  </div>
</div>

<div class="form-group organizationRow">
  <label class="col-sm-3 control-label" for="ResolutionDate">Beschlussdatum</label>
  <div class="col-sm-4">
    <input type="text" class="form-control" id="ResolutionDate" name="Initiator[resolutionDate]"
        value="' . $preResolution . '">
  </div>
</div>

<div class="form-group">
  <label class="col-sm-3 control-label" for="initiatorEmail">E-Mail</label>
  <div class="col-sm-4">
    <input type="text" class="form-control" id="initiatorEmail" name="Initiator[contactEmail]" ';
if ($settings->motionNeedsEmail) {
    echo 'required ';
}
echo 'value="' . $preEmail . '">
  </div>
</div>';

if ($settings->motionHasPhone) {
    echo '<div class="form-group phone_row">
        <label class="col-sm-3 control-label" for="initiatorPhone">Telefon</label>
  <div class="col-sm-4">
    <input type="text" class="form-control" id="initiatorPhone" name="Initiator[contactPhone]" ';
    if ($settings->motionNeedsPhone) {
        echo 'required ';
    }
    echo 'value="' . $prePhone . '">
  </div>
</div>';
}
echo '</div>';


if ($hasSupporters) {
    $getSupporterRow = function (ISupporter $supporter, $supporterOrga) {
        $str = '<div class="form-group supporterRow">';
        $str .= '<div class="col-md-6">';
        $str .= Html::textInput(
            'supporters[name][]',
            $supporter->name,
            ['class' => 'form-control name', 'placeholder' => 'Name']
        );
        $str .= '</div>';
        if ($supporterOrga) {
            $str .= '<div class="col-md-5">';
            $str .= Html::textInput(
                'supporters[organization][]',
                $supporter->organization,
                ['class' => 'form-control organization', 'placeholder' => 'Gremium, LAG, ...']
            );
            $str .= '</div>';
        }
        $str .= '<div class="col-md-1"><a href="#" class="rowDeleter">';
        $str .= '<span class="glyphicon glyphicon-minus-sign"></span>';
        $str .= '</a></div>';

        $str .= '</div>';
        return $str;
    };

    while (count($supporters) < $minSupporters) {
        $supp         = new \app\models\db\MotionSupporter();
        $supporters[] = $supp;
    }
    echo '<h2 class="green">' . 'UnterstützerInnen' . '</h2>';
    echo '<div class="supporterData form-horizontal content" ';
    echo 'data-min-supporters="' . Html::encode($minSupporters) . '">';

    echo '<div class="form-group"><div class="col-md-3">';
    echo str_replace('%min%', $minSupporters, "Min. %min% UnterstützerInnen");
    echo '</div>';

    echo '<div class="col-md-9">';
    foreach ($supporters as $supporter) {
        echo $getSupporterRow($supporter, $supporterOrga);
    }

    echo '<div class="adderRow"><a href="#"><span class="glyphicon glyphicon-plus"></span> ';
    echo 'Zeile hinzufügen';
    echo '</a></div>';

    if ($supporterFulltext) {
        echo '<div class="fullTextAdder"><a href="#">Volltextfeld</a></div>';
        echo '<div class="form-group" id="fullTextHolder">';
        echo '<div class="col-md-9">';
        echo '<textarea class="form-control" placeholder="UnterstützerInnen" rows="10"></textarea>';
        echo '</div><div class="col-md-3">';
        echo '<button type="button" class="btn btn-success fullTextAdd">';
        echo '<span class="glyphicon glyphicon-plus"></span> Hinzufügen</button>';
        echo '</div>';
        echo '</div>';
    }

    echo '</div>';
    echo '</div>';

    $new    = new \app\models\db\MotionSupporter();
    $newStr = $getSupporterRow($new, $supporterOrga);
    echo '<div id="newSupporterTemplate" style="display: none;" data-html="' . Html::encode($newStr) . '"></div>';

    echo '</div>';
}


echo '</fieldset>';

$controller->layoutParams->addOnLoadJS(
    '$.Antragsgruen.defaultInitiatorForm();'
);
