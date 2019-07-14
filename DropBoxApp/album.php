<html>
    <title>Dropbox</title>
    <body>


        <form action="album.php" method="post" enctype="multipart/form-data" style="background-color: #FAFAFA ">
            <fieldset><legend>Browse the Files</legend>
                <label>
                    <br>Select file: <input type="file" name="userfile">
                </label><br><br>
                <input type="submit" value="Upload image">
            </fieldset> </form>


        <?php
        require_once 'demo-lib.php';
        demo_init();

        set_time_limit(0);

        require_once 'DropboxClient.php';

        $dropbox = new DropboxClient(array(
            'app_key' => "yw0kr8yhj0ozc2m",
            'app_secret' => "b4sdnu7wo4aw167",
            'app_full_access' => false,
        ));

        $return_url = "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'] . "?auth_redirect=1";

        $bearer_token = demo_token_load("bearer");

        if ($bearer_token) {
            $dropbox->SetBearerToken($bearer_token);
            //echo "loaded bearer token: " . json_encode($bearer_token, JSON_PRETTY_PRINT) . "\n";
        } elseif (!empty($_GET['auth_redirect'])) { // are we coming from dropbox's auth page?
            // get & store bearer token
            $bearer_token = $dropbox->GetBearerToken(null, $return_url);
            demo_store_token($bearer_token, "bearer");
        } elseif (!$dropbox->IsAuthorized()) {
            // redirect user to Dropbox auth page
            $auth_url = $dropbox->BuildAuthorizeUrl($return_url);
            die("Authentication required. <a href='$auth_url'>Continue.</a>");
        }
        // print_r($_FILES);

        if (isset($_REQUEST['delete_id'])) {

            $var = $_REQUEST['delete_id'];
            $dropbox->Delete($var);
            $var = $dropbox->GetFiles("", false);
        }

        if (isset($_REQUEST['download_id'])) {

            $var = $_REQUEST['download_id'];

            $files = $dropbox->GetFiles("", false);
            $file = $files[$var];
            //print_r($file);
 
            $test_file = "downloaded_" . basename($file->path);
            $downloaded = $dropbox->DownloadFile($file, $test_file);
            //echo '<pre>';
            //print_r($downloaded);

            $img_data = base64_encode($dropbox->GetThumbnail($downloaded->path));
            echo "<img src=\"data:image/jpeg;base64,$img_data\" alt=\"Generating PDF thumbnail failed!\" style=\"border: 1px solid black;\" />";
        }


        if (isset($_FILES['userfile'])) {

            $dropbox->UploadFile($_FILES['userfile']['tmp_name'], $_FILES['userfile']['name']);
        }
        $files = $dropbox->GetFiles("", false);

        //print_r($files);

        echo "<table style='width:50%;border:1px solid black ' >";
        echo "<th style='background-color: lightgray;border:1px solid black'>Image Name</th> ";
        echo "<th style='background-color: lightgray;border:1px solid black'>Action from Dropbox</th> ";

        foreach ($files as $key) {

            //print_r($key);
            echo "<tr>";
            echo " <td style='border:1px solid black'> <a href=album.php?download_id=" . $key->name . "> $key->name</a></td><br>";
            echo " <td style='border:1px solid black'> <a href=album.php?delete_id=" . $key->path . "> delete</a></td><br>";
            echo "</tr>";
        }
        echo"</table>";

//            $img_data = base64_encode($dropbox->GetThumbnail($jpg_file->path));
//            echo "<img src=\"data:image/jpeg;base64,$img_data\" alt=\"Generating PDF thumbnail failed!\" style=\"border: 1px solid black;\" />";
//        }

        error_reporting(E_ALL);
        ini_set('display_errors', 'On');
        ?>
    </body>
</html>
