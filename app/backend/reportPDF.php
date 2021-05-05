<?php
include('./TCPDF/tcpdf.php');

//main var
$vin = $_POST['vin'];
$regNum = $_POST['regNum'];
$mainInfo = json_decode($_POST['mainInfo'], true);
$wanted = json_decode($_POST['wanted'], true);
$limitation = json_decode($_POST['limitation'], true);
$trfacc = json_decode($_POST['trfacc'], true);
$mileage = json_decode($_POST['mileage'], true);
$policy = json_decode($_POST['policy'], true);
$deposit = json_decode($_POST['deposit'], true);
$leasing = json_decode($_POST['leasing'], true);
$photo = json_decode($_POST['photo'], true);
$taxi = json_decode($_POST['taxi'], true);

    // echo '<pre>';
    // var_dump($mainInfo);
    // var_dump($_POST['mainInfo']);
    // echo '</pre>';

//image 
$ok = 'image/ok.png';
$smiley = 'image/smiley.png';

//main style 
$style_table = "
<style>
table {
    border-collapse:collapse;
}
th,td {
    border:1px solid #59538a;
}
table tr th {
    background-color:#f83858;
    color:#fff;
    font-weight:bold;
}
</style>";

//custom class (header, footer) for PDF 
class MYPDF extends TCPDF {
    //Header
    public function Header() {
        $image_path = 'image/logo.png';
        $this->SetY(2);
        $this->Image($image_path, 7, 7, 45, '', 'png', '', 'T', false, 300, '', false, false, 0, false, false, false);
        if($photo["count"] && $photo["records"][0]["urlNumber"] != "") {
            $img_b64_logo = base64_encode(file_get_contents($photo["records"][0]["urlNumber"]));
            $this->Image('@'.base64_decode($img_b64_logo), '', '', 55, 10, '', false, 'R', false, 300, 'R', false, false, 0, false, false, false);
        }
        $this->SetY(11);
    }

    //Footer
    public function Footer() {
        $this->SetY(-15);
        $this->SetFont('helvetica', 'I', 8);
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
    }
}

function voidReplace($text) {
    if($text == "" || $text == null || $text == "null") 
        return '-----';
    else 
        return $text;
}


$tcpdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
    $tcpdf->AddPage();
    $tcpdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
    //VIN, Гос. номер, Модель, Цвет
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Text(15, 30, 'VIN: ');
        $tcpdf->Text(15, 40, 'Гос. номер: ');
        $tcpdf->Text(15, 50, 'Модель: ');
        $tcpdf->Text(15, 60, 'Цвет: ');
        $tcpdf->Text(15, 70, 'Номер двиг.: ');
        $tcpdf->Text(15, 80, 'Номер кузова: ');
        //Данные
        $tcpdf->SetFont('freesans', 'B', 10);
        $tcpdf->Text(45, 30, $vin);
        $tcpdf->Text(45, 40, $regNum);
        $tcpdf->Text(45, 50, $mainInfo["vehicle"]["model"]);
        $tcpdf->Text(45, 60, $mainInfo["vehicle"]["color"]);
        $tcpdf->Text(45, 70, $mainInfo["vehicle"]["engineNumber"]);
        $tcpdf->Text(45, 80, $mainInfo["vehicle"]["bodyNumber"]);

    //Год, Рабочий объем, Мощность, Категория
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Text(100, 30, 'Год: ');
        $tcpdf->Text(100, 40, 'Рабочий объем: ');
        $tcpdf->Text(100, 50, 'Мощность л.с: ');
        $tcpdf->Text(100, 60, 'Категория ТС: ');
        $tcpdf->Text(100, 70, 'Тип ТС: ');
        $tcpdf->Text(100, 80, 'Мощность кВт: ');
        //Данные
        $tcpdf->SetFont('freesans', 'B', 10);
        $tcpdf->Text(130, 30, $mainInfo["vehicle"]["year"]);
        $tcpdf->Text(130, 40, $mainInfo["vehicle"]["engineVolume"]);
        $tcpdf->Text(130, 50, $mainInfo["vehicle"]["powerHp"]);
        $tcpdf->Text(130, 60, $mainInfo["vehicle"]["category"]);
        $tcpdf->Text(130, 70, $mainInfo["vehicle"]["typeinfo"]);
        $tcpdf->Text(130, 80, $mainInfo["vehicle"]["powerKwt"]);

    //История регистрации 
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', 'B', 18);
        $tcpdf->Cell(0, 0, 'История регистрации ', 0, 0, 'C');

    if(sizeof($mainInfo["ownershipPeriod"])) {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Ln(6);
        $historyReg = "
            <table>
                <tr>
                    <th>Причина рег.</th>
                    <th>Тип владелец</th>
                    <th>Дата рег.</th>
                    <th>Дата снятия</th>
                </tr>
        ";
        foreach($mainInfo["ownershipPeriod"] as $hisReg) {
            $historyReg .= "
                <tr>
                    <td>".voidReplace($hisReg["lastOperationInfo"])."</td>
                    <td>".voidReplace($hisReg["simplePersonTypeInfo"])."</td>
                    <td>".voidReplace($hisReg["from"])."</td>
                    <td>".voidReplace($hisReg["to"])."</td>
                </tr>
            ";
        }
        $historyReg .= "</table>".$style_table;

        $tcpdf->writeHTMLCell(0, 0, 15, '', $historyReg, 0, 1, 0, true, 'C', true);
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'Регистрация ТС не найдена ', 0, 0, 'C');
        $tcpdf->Ln(6);
    }
    //Проверка на розыск
        $tcpdf->Ln(6);
        $tcpdf->SetFont('dejavusans', 'B', 18);
        $tcpdf->Cell(0, 0, 'Проверка на розыск', 0, 0, 'C');
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);

    if($wanted["count"]) {
        $tcpdf->Ln(6);
        $tcpdf->SetX(10);
        $checkDetected = "
        <table>
            <tr>
                <th>Регион инициатора</th>
                <th>Номер кузова</th>
                <th>Марка ТС</th>
                <th>Дата учета</th>
            </tr>
        ";
        foreach($wanted["records"] as $wanRec) {
            $checkDetected .= "
            <tr>
                <td>".$wanRec["w_reg_inic"]."</td>
                <td>".$wanRec["w_kuzov"]."</td>
                <td>".$wanRec["w_model"]."</td>
                <td>".$wanRec["w_data_pu"]."</td>
            </tr>        
        ";
        }
        $checkDetected .= "</table>".$style_table;

        $tcpdf->writeHTMLCell(0, 0, 15, '', $checkDetected, 0, 1, 0, true, 'C', true);
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'ТС в розыске не найдена ', 0, 0, 'C');
        $tcpdf->Ln(10);
        $tcpdf->Image($ok, '', '', 20, 17, 'PNG', false, 'C', false, 300, 'C', false, false, 0, false, false, false);
        $tcpdf->Ln(24);
    }
    //Проверка на ограничения
    $tcpdf->Ln(11);
    $tcpdf->SetFont('dejavusans', 'B', 18);
    $tcpdf->Cell(0, 0, 'Проверка на ограничения', 0, 0, 'C');
    $tcpdf->Ln(11);
    
    if($limitation["count"]) {
        foreach($limitation["records"] as $limRec) {
            $tcpdf->Ln(6);
            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Регион: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["regname"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Основания: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->writeHTMLCell(120, 0, '', '',  $limRec["osnOgr"], 0, 1, 0, true, 'L', true);
            $tcpdf->Ln(8);
            
            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Ключ ГИБДД: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["gid"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Дата наложения: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["dateogr"].' - '.$limRec["dateadd"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Вид ограничения: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["ogrkodinfo"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Телефон инициатора: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["phone"]);
            $tcpdf->Ln(8);
            
            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Кем наложено: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["divtypeinfo"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Год ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["tsyear"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'VIN ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["tsVIN"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Модель ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["tsmodel"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Номер кузова ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $limRec["tsKuzov"]);
            $tcpdf->Ln(8);

            $tcpdf->Ln(3);
            $tcpdf->Cell(0, 0, '', 'B');
        }
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'Огрничения не найдены ', 0, 0, 'C');
        $tcpdf->Ln(10);
        $tcpdf->Image($ok, '', '', 20, 17, 'PNG', false, 'C', false, 300, 'C', false, false, 0, false, false, false);
        $tcpdf->Ln(24);
    }
    //проверка на ДТП 
 
    $tcpdf->Ln(15);
    $tcpdf->SetFont('dejavusans', 'B', 18);
    $tcpdf->Cell(0, 0, 'Проверка на ДТП', 0, 0, 'C');
    $tcpdf->Ln(11);

    if($trfacc["count"]) {
        foreach($trfacc["records"] as $trRec) {
            $img_b64 = base64_encode(file_get_contents('https://mini.s-shot.ru/450x450/JPEG/450/Z100/?'.urlencode($trRec["DamagePointsSVG"])));
            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Ln(6);
            $tcpdf->Image('@'.base64_decode($img_b64), 120, '', 60, 60);
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Повреждения: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["VehicleDamageState"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Номер инцидента: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["AccidentNumber"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Тип: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["AccidentType"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Количество авто: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["VehicleAmount"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Владелец авто: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["OwnerOkopf"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Регион владения: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["RegionName"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Место ДТП: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->writeHTMLCell(120, 0, '', '',  $trRec["AccidentPlace"], 0, 1, 0, true, 'L', true);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Описание ДТП: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->writeHTMLCell(120, 0, '', '', $trRec["DamageDestription"], 0, 1, 0, true, 'L', true);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Дата ДТП: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["AccidentDateTime"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Марка ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["VehicleMark"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Модель ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["VehicleModel"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Год выпуска ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $trRec["VehicleYear"]);


            $tcpdf->Ln(1);
            $tcpdf->Cell(0, 0, '', 'B');
            $tcpdf->Ln(6);
        }
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'ДТП не найдены ', 0, 0, 'C');
        $tcpdf->Ln(10);
        $tcpdf->Image($ok, '', '', 20, 17, 'PNG', false, 'C', false, 300, 'C', false, false, 0, false, false, false);
        $tcpdf->Ln(24);
    }
    //проверка полиса осаго 

    $tcpdf->Ln(11);
    $tcpdf->SetFont('dejavusans', 'B', 18);
    $tcpdf->Cell(0, 0, 'Проверка полиса ОСАГО', 0, 0, 'C');
    $tcpdf->Ln(11);
    if(!isset($policy["status"]) && sizeof($policy)) {
        foreach($policy as $poli) {
            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Ln(6);
            $tcpdf->Cell(57, 0, 'Серия ОСАГО: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["seria"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Номер ОСАГО: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["nomer"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Страховой организации: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["orgosago"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Статус договора ОСАГО: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["status"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Срок действия ОСАГО: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["term"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Марка и модель ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["brandmodel"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Гос. номер ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["regnum"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'VIN ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["vin"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Мощность в л.с: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["power"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Управление ТС с прицепом: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["trailer"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Цель использования ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["cel"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Допущенные лица: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["ogran"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Страхователь: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["insured"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Собственник: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["owner"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'КБМ по договору ОСАГО: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["kbm"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'ТС используется: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["region"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Страховая премия: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["strahsum"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Дата актуальности: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $poli["dateactual"]);
            $tcpdf->Ln(8);

            $tcpdf->Cell(0, 0, '', 'B');
            $tcpdf->Ln(5);
        }
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'Данные не найдены ', 0, 0, 'C');
        $tcpdf->Ln(6);
    }
    //залог по vin
    $tcpdf->Ln(6);
    $tcpdf->SetFont('dejavusans', 'B', 18);
    $tcpdf->Cell(0, 0, 'Проверка залога и лизинга', 0, 0, 'C');
    $tcpdf->Ln(11);

    if($deposit["num"]) {
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Ln(6);
        $tcpdf->SetX(10);
        $deposit_html = "
        <table>
            <tr>
                <th>Дата возникновения залога</th>
                <th>Залогодатели</th>
                <th>Залогодержатели</th>
            </tr>
        ";
        foreach($deposit["rez"] as $depRez ) {
            $deposit_html .= "
                <tr>
                    <td>".$depRez["regDate"]."</td>";
            //Залогодатели
            $deposit_html .= "<td>";
            foreach($depRez["pledgors"] as $pledgors) {
                $deposit_html .= $pledgors["name"]." - ".$pledgors["birthday"]."<br>"; 
            }
            $deposit_html .= "</td>";
            //Залогодержатели
            $deposit_html .= "<td>";
            foreach($depRez["pledgees"] as $pledgees) {
                $deposit_html .= $pledgees["name"]."<br><br>"; 
            }
            $deposit_html .= "</td>";

            $deposit_html .= "</tr>";
            $deposit_html .= "</table>".$style_table;
            $tcpdf->writeHTMLCell(0, 0, 15, '', $deposit_html, 0, 1, 0, true, 'C', true);
        }
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'В базе залогов не найдено', 0, 0, 'C');
        $tcpdf->Ln(10);
        $tcpdf->Image($ok, '', '', 20, 17, 'PNG', false, 'C', false, 300, 'C', false, false, 0, false, false, false);
        $tcpdf->Ln(24);
    }
    //проверка на наличие в лизинге 
    
    if($leasing["num"] && sizeof($leasing["rez"])) {
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Ln(6);
        $tcpdf->Cell(57, 0, 'Информация о лизинге: ');
        $tcpdf->SetFont('freesans', 'B', 10);
        $tcpdf->writeHTMLCell(120, 0, '', '', $leasing["rez"], 0, 1, 0, true, 'L', true);
        $tcpdf->Ln(8);
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'В лизинге не найдено', 0, 0, 'C');
        $tcpdf->Ln(10);
        $tcpdf->Image($ok, '', '', 20, 17, 'PNG', false, 'C', false, 300, 'C', false, false, 0, false, false, false);
        $tcpdf->Ln(24);
    }

    //такси
    $tcpdf->SetFont('dejavusans', 'B', 18);
    $tcpdf->Cell(0, 0, 'Проверка на наличие в такси', 0, 0, 'C');
    $tcpdf->Ln(11);
    if(!isset($taxi["num"]) && sizeof($taxi)) {
        foreach($taxi as $tx) {
            $tcpdf->Ln(6);
            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Статус: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["status"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Дата выдачи: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["date_issue"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Номер разрешения: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["permit_number"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Владелец разрешения: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["permit_owner"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'ИНН: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["inn"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Марка ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["auto_marka"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Модель ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["model"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Гос. номер ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["regnum"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Год выпуска ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["auto_year"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Номер бланка разрешения: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["permit_seria"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'ЮЛ или ИП: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, voidReplace($tx["nameulip"]));
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Дата изменений: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, voidReplace($tx["date_modification"]));
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Срок действия разрешения: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, voidReplace($tx["permit_term"]));
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Регион выдачи разрешения: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $tx["region"]);
            $tcpdf->Ln(8);

            $tcpdf->Cell(0, 0, '', 'B');
            $tcpdf->Ln(5);
        }
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'В базе такси не найдено', 0, 0, 'C');
        $tcpdf->Ln(10);
        $tcpdf->Image($ok, '', '', 20, 17, 'PNG', false, 'C', false, 300, 'C', false, false, 0, false, false, false);
        $tcpdf->Ln(24);
    }
    //пробег
    $tcpdf->Ln(11);
    $tcpdf->SetFont('dejavusans', 'B', 18);
    $tcpdf->Cell(0, 0, 'Проверка диагностических карт, пробег', 0, 0, 'C');
    $tcpdf->Ln(11);
    
    if($mileage["count"]) {
        foreach($mileage["records"] as $milRec) {
            $tcpdf->Ln(6);
            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Дата окончания ДК: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["dcExpirationDate"] );
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Адрес выдачи ДК: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->writeHTMLCell(120, 0, '', '', $milRec["pointAddress"], 0, 1, 0, true, 'L', true);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Шасси: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["chassis"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Кузов: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["body"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Оператор: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["operatorName"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Показания одометра: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["odometerValue"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Номер ДК: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["dcNumber"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Дата выдачи ДК: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["dcDate"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'VIN ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["vin"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Модель ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["model"]);
            $tcpdf->Ln(8);

            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(57, 0, 'Марка ТС: ');
            $tcpdf->SetFont('freesans', 'B', 10);
            $tcpdf->Cell(57, 0, $milRec["brand"]);
            $tcpdf->Ln(8);

            if($milRec["previousDcs"]) {
                $tcpdf->Ln(6);
                $tcpdf->SetX(10);
                $previous_html = "
                <table>
                    <tr>
                        <th>Прошлые показания</th>
                        <th>Дата окончания ДК</th>
                        <th>Номер ДК</th>
                        <th>Дата начала ДК</th>
                    </tr>
                ";
                foreach($milRec["previousDcs"] as $preDc) {
                    $previous_html .= "
                        <tr>
                            <td>".$preDc["odometerValue"]."</td>
                            <td>".$preDc["dcExpirationDate"]."</td>
                            <td>".$preDc["dcNumber"]."</td>
                            <td>".$preDc["dcDate"]."</td>
                        </tr>
                        ";
                }
                        
                    $previous_html .= "</table>".$style_table;
                $tcpdf->writeHTMLCell(0, 0, 15, '', $previous_html, 0, 1, 0, true, 'C', true);
            }
            $tcpdf->Ln(8);

            $tcpdf->Cell(0, 0, '', 'B');
            $tcpdf->Ln(5);
        }
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'Данные о ДК не найдены', 0, 0, 'C');
        $tcpdf->Ln(10);
        $tcpdf->Image($smiley, '', '', 20, 20, 'PNG', false, 'C', false, 300, 'C', false, false, 0, false, false, false);
        $tcpdf->Ln(24);

    }
    //фото 
    $tcpdf->Ln(15);
    $tcpdf->SetFont('dejavusans', 'B', 18);
    $tcpdf->Cell(0, 0, 'Фото авто по Гос. номеру', 0, 0, 'C');
    $tcpdf->Ln(11);
    if($photo["count"]) {
        foreach($photo["records"] as $phRec) {
            $tcpdf->SetFont('dejavusans', '', 10);
            $tcpdf->Cell(0, 0, $phRec["info"].' - '.$phRec["add"], 0, 0, 'C');
            $tcpdf->Ln(5);
            $tcpdf->writeHTMLCell(0, 0, 15, '', '<img src="'.$phRec["urlphoto"].'">', 0, 1, 0, true, 'C', true);
            $tcpdf->Ln(8);
            $tcpdf->AddPage();
        }
    } else {
        $tcpdf->Ln(11);
        $tcpdf->SetFont('dejavusans', '', 10);
        $tcpdf->Cell(0, 0, 'Фото ТС по номеру не найдены', 0, 0, 'C');
        $tcpdf->Ln(10);
        $tcpdf->Image($smiley, '', '', 20, 20, 'PNG', false, 'C', false, 300, 'C', false, false, 0, false, false, false);
        $tcpdf->Ln(24);
    }
    
//save
$tcpdf->Output(__DIR__ . '/report_'.$vin.'.pdf', 'F');
echo 'report_'.$vin.'.pdf';
exit();