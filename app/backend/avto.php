<?php
set_time_limit(0);
const TOKEN = '5bed5805eee506590a0d889451647c8b';
$vin = $_POST['vin'];


//конвертация vin ---> гос. номер 
$curl_solo = curl_init();
curl_setopt_array($curl_solo, array(
  CURLOPT_URL => "https://api-cloud.ru/api/converter.php/?type=vin&vin=".$vin."&token=".TOKEN,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
));

$response = curl_exec($curl_solo);
curl_close($curl_solo);

$regNum = json_decode($response)[0]->{"regnum"};


//получение всей инфы по VIN и гос. номеру 
$urls = array(
    "https://api-cloud.ru/api/gibdd.php/?type=gibdd&vin=".$vin."&token=".TOKEN,                // основ. инфа 
    "https://api-cloud.ru/api/gibdd.php/?type=wanted&vin=".$vin."&token=".TOKEN,               // проверка на розыск
    "https://api-cloud.ru/api/gibdd.php/?type=restrict&vin=".$vin."&token=".TOKEN,             // проверка на огроничения 
    "https://api-cloud.ru/api/gibdd.php/?type=dtp&vin=".$vin."&token=".TOKEN,                  // проверка на ДТП
    "https://api-cloud.ru/api/gibdd.php?vin=".$vin."&type=eaisto&token=".TOKEN,                // проверка диаг. карт и пробега
    "https://api-cloud.ru/api/rsa.php?type=osago&vin=".$vin."&token=".TOKEN,                   // проверка полиса ОСАГА    
    "https://api-cloud.ru/api/zalog.php/?type=notary&vin=".$vin."&token=".TOKEN,               // проверка залога по VIN
    "https://api-cloud.ru/api/zalog.php/?type=fedresurs&vin=".$vin."&token=".TOKEN,            // проверка на налчиие в лизинге 
    "https://api-cloud.ru/api/autophoto.php/?type=regnum&regNum=".$regNum."&token=".TOKEN,     // фото авто по гос. номеру
    "https://api-cloud.ru/api/taxi.php/?type=regnum&regnum=".$regNum."&token=".TOKEN           // проверка авто в такси 
);

$nameKeyArray = array(
    "mainInfo",  
    "wanted",
    "limitation",
    "trfacc",
    "mileage",
    "policy",
    "deposit",
    "leasing",
    "photo",
    "taxi"
);

//[curl_solo]=================Долгий запрос, но полный (2 - 6мин)
// $myArr = [];
// foreach($urls as $url) {
//     $ch = curl_init($url);
//     curl_setopt_array($ch, array(
//         CURLOPT_URL => $url,
//         CURLOPT_RETURNTRANSFER => true,
//         CURLOPT_ENCODING => '',
//         CURLOPT_MAXREDIRS => 10,
//         CURLOPT_TIMEOUT => 0,
//         CURLOPT_FOLLOWLOCATION => true,
//         CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//         CURLOPT_CUSTOMREQUEST => 'POST',
//     ));

//     $res = curl_exec($ch);
//     curl_close($ch);

//     array_push($myArr, json_decode($res));
// }
// echo json_encode($myArr);


//[curl_multi]=================Быстрый запрос, но не полный (30с - 2мин)
// $urls = array(
//     'http://localhost:8090/api/main',
//     'http://localhost:8090/api/main2',
//     'http://localhost:8090/api/main3',
//     'http://localhost:8090/api/main4',
//     'http://localhost:8090/api/main5',
// );

$multi = curl_multi_init();
$handles = [];
$active = null;
foreach($urls as $url) {
    $ch = curl_init($url);
    curl_setopt_array($ch, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
    ));

    curl_multi_add_handle($multi, $ch);
    $handles[$url] = $ch;
}


do {
    $mrc = curl_multi_exec($multi, $active);
} while ($mrc == CURLM_CALL_MULTI_PERFORM);


while ($active && $mrc == CURLM_OK) {
    
    if( curl_multi_select($multi) == -1) {
        usleep(100);
    }

    do {
        $mrc = curl_multi_exec($multi, $active);
    } while ($mrc == CURLM_CALL_MULTI_PERFORM);

}


$resAvto = [];

$i = 0;

foreach($handles as $channel) {
    $html = curl_multi_getcontent($channel);

    // echo '<pre>';
    // var_dump(json_decode($html));
    // echo '</pre>';

    $resAvto[$nameKeyArray[$i]] = json_decode($html);
    $i++;

    // array_push($resAvto, json_decode($html));
    curl_multi_remove_handle($multi, $channel);
}

curl_multi_close($multi);

$resAvto["VIN"] = $vin;
$resAvto["regNum"] = $regNum;

echo json_encode($resAvto);



// Добрый день, почему при использование curl_multi_init в php, большая часть запросов (70%) с ошибкой SERVICE_CAPTCHA_OFFLINE