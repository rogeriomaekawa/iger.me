<?php

spl_autoload_unregister(array('YiiBase', 'autoload'));
include(Yii::app()->basePath . '/extensions/phpmailer/class.phpmailer.php');
include(Yii::app()->basePath . '/extensions/phpmailer/class.smtp.php');
require_once(Yii::app()->basePath . '/extensions/googlelogin/src/apiClient.php');
require_once(Yii::app()->basePath . '/extensions/googlelogin/src/contrib/apiOauth2Service.php');
require_once(Yii::app()->basePath . '/extensions/facebooklogin/facebook/facebook.php');
require_once(Yii::app()->basePath . '/extensions/facebooklogin/config/fbconfig.php');
spl_autoload_register(array('YiiBase', 'autoload'));

class SiteController extends Controller
{
	public $layout='column2';

	/**
	 * @return array action filters
	 */
	public function filters()
	{
		return array(
			'accessControl', // perform access control for CRUD operations
		);
	}

	/**
	 * Specifies the access control rules.
	 * This method is used by the 'accessControl' filter.
	 * @return array access control rules
	 */
	public function accessRules()
	{
		return array(
			array('allow',  // allow all users to access 'index' and 'view' actions.
				'actions' => array('index', 'login', 'googleauth', 'signgoogle', 'signfacebook'),
				'users' => array('*'),
			),
			array('deny',  // deny all users
				'actions' => array('login'),
				'users' => array('@'),
			),
		);
	}
	/**
	 * Declares class-based actions.
	 */
	public function actions()
	{
		return array(
			// captcha action renders the CAPTCHA image displayed on the contact page
			'captcha'=>array(
				'class'=>'CCaptchaAction',
				'backColor'=>0xFFFFFF,
			),
			// page action renders "static" pages stored under 'protected/views/site/pages'
			// They can be accessed via: index.php?r=site/page&view=FileName
			'page'=>array(
				'class'=>'CViewAction',
			),
		);
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError()
	{
	    if($error=Yii::app()->errorHandler->error)
	    {
	    	if(Yii::app()->request->isAjaxRequest)
	    		echo $error['message'];
	    	else
	        	$this->render('error', $error);
	    }
	}

	/**
	 * Displays the contact page
	 */
	public function actionContact()
	{
		$model=new ContactForm;
		if(isset($_POST['ContactForm']))
		{
			$model->attributes=$_POST['ContactForm'];
			if($model->validate())
			{
				$headers="From: {$model->email}\r\nReply-To: {$model->email}";
				mail(Yii::app()->params['adminEmail'],$model->subject,$model->body,$headers);
				Yii::app()->user->setFlash('contact','Thank you for contacting us. We will respond to you as soon as possible.');
				$this->refresh();
			}
		}
		$this->render('contact',array('model'=>$model));
	}

	/**
	 * Displays the login page
	 */
	public function actionLogin()
	{
		if (Yii::app()->user->id)
		$this->redirect(Yii::app()->createUrl("/site/index"));		
		$instagram = Yii::app()->instagram;
		$loginUrl = $instagram->getLoginUrl();
		$googleUrl = $this->GoogleLogin(); 

		$this->render('login',array(
			'loginUrl'=>$loginUrl,
			'googleUrl'=>$googleUrl,
		));
	}
	/**
	 * running when login success
	 */
	public function actionSuccess()
	{
		$instagram = Yii::app()->instagram;
		// receive OAuth code parameter
		$code = $_GET['code'];

		// check whether the user has granted access
		if (isset($code)) {
		  	// receive OAuth token object
		  	$data = $instagram->getOAuthToken($code);	
		  	$username  = $data->user->username;
		  	$user_id = $data->user->id;
		  	$avatar = $data->user->profile_picture;
		  	
		 	// store user access token
		  	$instagram->setAccessToken($data);

		  	// now you have access to all authenticated user methods
		  	$result = $instagram->getUserMedia();
		  	if ($data)
		  	{
		  		// save this information to db
			  	$user = new User('instagram_login');
			  	$user->username = $username;
			  	$user->instagram_id = $data->user->id;
			  	$user->access_token = $instagram->getAccessToken($data);
			  	$user->full_name = $data->user->full_name;	
			  	$user->avatar = $avatar;
			  	// check if instagram_id is unique then save to db
			  	$user = $user->zeroUnique();

			  	if (!isset(Yii::app()->user->id)) {
			  		// login automatically
			  		Yii::app()->user->login(UserIdentity::createAuthenticatedIdentity($user->username, $user->id), 0);
			  		$this->redirect(Yii::app()->createUrl("/user/activity"));
			  	}

		  		$this->redirect(Yii::app()->createUrl("/user/account"));
		  	}
		  	else
		  	{
		  		throw new CHttpException('There are some issues with login on instagram.');
		  	}

		} else {

		  	// check whether an error occurred
		  	if (isset($_GET['error'])) {
		    	echo 'An error occurred: ' . $_GET['error_description'];
		  	}

		}

		$this->render('success', array(
			'result' => $result,
			'username' => $username
		));
	}
	/**
	 * Logs out the current user and redirect to homepage.
	 */
	public function actionLogout()
	{
		Yii::app()->user->logout();
		$this->redirect(Yii::app()->homeUrl);
	}

	public function actionIndex() 
	{
		$instagram = Yii::app()->instagram;
		$loginUrl = $instagram->getLoginUrl();
		
		$this->render('index',array(
			'loginUrl'=>$loginUrl,
			
		));
	}
	public function actionAbout()
	{
		
		$instagram = Yii::app()->instagram;
		$loginUrl = $instagram->getLoginUrl();
		
		$this->render('about',array(
			'loginUrl'=>$loginUrl,
			
		));
	}
	public function actionTerms()
	{
		
		$instagram = Yii::app()->instagram;
		$loginUrl = $instagram->getLoginUrl();
		
		$this->render('terms',array(
			'loginUrl'=>$loginUrl,
			
		));
	}
	public function actionPrices()
	{
			
		$instagram = Yii::app()->instagram;
		$loginUrl = $instagram->getLoginUrl();
		
		$this->render('prices',array(
			'loginUrl'=>$loginUrl,
			
		));
	}
	public function actionGuide()
	{
		
		$instagram = Yii::app()->instagram;
		$loginUrl = $instagram->getLoginUrl();
		
		$this->render('guide',array(
			'loginUrl'=>$loginUrl,
			
		));
	}
	public function actionBlog()
	{
			
		$instagram = Yii::app()->instagram;
		$loginUrl = $instagram->getLoginUrl();
		$googleUrl = $this->GoogleLogin(); 
		
		$this->render('blog',array(
			'loginUrl'=>$loginUrl,
			
		));
	}

	public function GoogleLogin()
	{
		$client = new apiClient();
		$client->setApplicationName("Google Account Login");
		// Visit https://code.google.com/apis/console?api=plus to generate your
		// oauth2_client_id, oauth2_client_secret, and to register your oauth2_redirect_uri.
		// $client->setClientId('insert_your_oauth2_client_id');
		// $client->setClientSecret('insert_your_oauth2_client_secret');
		// $client->setRedirectUri('insert_your_redirect_uri');
		// $client->setDeveloperKey('insert_your_developer_key');
		$oauth2 = new apiOauth2Service($client);
		
		if (isset($_GET['code'])) {
		  $client->authenticate();
		  $_SESSION['token'] = $client->getAccessToken();
		  $redirect = Yii::app()->createUrl("/site/googleauth");
		  header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
		}
		if (isset($_SESSION['token'])) {
		 $client->setAccessToken($_SESSION['token']);
		}
		if (isset($_REQUEST['logout'])) {
		  unset($_SESSION['token']);
		  unset($_SESSION['google_data']); //Google session data unset
		  $client->revokeToken();
		}
		if ($client->getAccessToken()) {
		  $user = $oauth2->userinfo->get();
		  print_r($user);
		
		  $_SESSION['google_data']=$user;
		  $this->redirect(Yii::app()->createUrl('/site/OauthGoogle'));
		  //$this->redirect(Yii::app()->createUrl('/oauthgoogle'));
		  // These fields are currently filtered through the PHP sanitize filters.
		  // See http://www.php.net/manual/en/filter.filters.sanitize.php
		 // $email = filter_var($user['email'], FILTER_SANITIZE_EMAIL);
		 // $img = filter_var($user['picture'], FILTER_VALIDATE_URL);
		  //$personMarkup = "$email<div><img src='$img?sz=50'></div>";
		  // The access token may have been updated lazily.
		  $_SESSION['token'] = $client->getAccessToken();
		} else {
		  $authUrl = $client->createAuthUrl();
		}
		if(isset($authUrl)) {
			//return "<a class='login' href='$authUrl'>Google Account Login</a>";
			return $authUrl;
			
		} else {
			return "<a class='logout' href='?logout'>Logout</a>";
		}		
		
		//$this->render('google_login');	
	}

	public function actionGoogleAuth()
	{
		$client = new apiClient();
		$client->setApplicationName("Google Account Login");
		// Visit https://code.google.com/apis/console?api=plus to generate your
		// oauth2_client_id, oauth2_client_secret, and to register your oauth2_redirect_uri.
		// $client->setClientId('insert_your_oauth2_client_id');
		// $client->setClientSecret('insert_your_oauth2_client_secret');
		// $client->setRedirectUri('insert_your_redirect_uri');
		// $client->setDeveloperKey('insert_your_developer_key');
		$oauth2 = new apiOauth2Service($client);
		
		if (isset($_GET['code'])) {
		  $client->authenticate();
		  $_SESSION['token'] = $client->getAccessToken();
		  $redirect = Yii::app()->createUrl("/site/googleauth");
		  header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
		}
		if (isset($_SESSION['token'])) {
		 $client->setAccessToken($_SESSION['token']);
		}
		if (isset($_REQUEST['logout'])) {
		  unset($_SESSION['token']);
		  unset($_SESSION['google_data']); //Google session data unset
		  $client->revokeToken();
		}
		
		if ($client->getAccessToken()) {
		  $user = $oauth2->userinfo->get();
		  print_r($user);
		
		  $_SESSION['google_data']=$user;
		  $this->redirect(Yii::app()->createUrl('/site/OauthGoogle'));
		  //$this->redirect(Yii::app()->createUrl('/oauthgoogle'));
		  // These fields are currently filtered through the PHP sanitize filters.
		  // See http://www.php.net/manual/en/filter.filters.sanitize.php
		 // $email = filter_var($user['email'], FILTER_SANITIZE_EMAIL);
		 // $img = filter_var($user['picture'], FILTER_VALIDATE_URL);
		  //$personMarkup = "$email<div><img src='$img?sz=50'></div>";
		  // The access token may have been updated lazily.
		  $_SESSION['token'] = $client->getAccessToken();
		} else {
		  $authUrl = $client->createAuthUrl();
		}
		if(isset($authUrl)) {
			//return "<a class='login' href='$authUrl'>Google Account Login</a>";
			echo $authUrl;
			
		} else {
			return "<a class='logout' href='?logout'>Logout</a>";
		}		
		
		//$this->render('google_login');	
	}		

	public function actionOauthGoogle()
	{
		
		if (!isset($_SESSION['google_data'])) {
			// Redirection to login page twitter or facebook
			Yii::app()->user->setFlash('notice', 'Usuário e/ou senha inválidos.');
			$this->redirect(Yii::app()->createUrl('/site'));
		}else{	
			// save this information to db
			
			$user = new User();
			$user->username = $_SESSION['google_data']['email'];
			$user->email = $_SESSION['google_data']['email'];
			$user->password = md5($_SESSION['google_data']['id']);
			$user->google_id = $_SESSION['google_data']['id'];
			$user->full_name = $_SESSION['google_data']['name'];	
			$user->avatar = $_SESSION['google_data']['picture'];
			
			$user->zeroUniqueGoogle();
				
			// check if instagram_id is unique then save to db
			//$user = $user->zeroUniqueGoogle();

			if (!isset(Yii::app()->user->id)) {
				
				// login automatically
				Yii::app()->user->login(UserIdentity::createAuthenticatedIdentity($user->username, $user->googleIdToId($user->google_id)), 0);
				$this->redirect(Yii::app()->createUrl("/user/account"));
			}

			$this->redirect(Yii::app()->createUrl("/user/account"));
		}
	}		
	
	public function actionSignGoogle()
	{
		$this->redirect($this->GoogleLogin());
	}
	
	public function FacebookLogin()
	{
		$facebook = new Facebook(array(
					'appId' => APP_ID,
					'secret' => APP_SECRET,
					));

		$login_url = $facebook->getLoginUrl(array( 'scope' => 'email'));
		return $login_url;
	}

	public function actionOauthFacebookLogin()
	{
		$facebook = new Facebook(array(
					'appId' => APP_ID,
					'secret' => APP_SECRET,
					));
					
		$user = $facebook->getUser();
		
		if ($user) {
		  try {
			// Proceed knowing you have a logged in user who's authenticated.
			$user_profile = $facebook->api('/me');
		  } catch (FacebookApiException $e) {
			error_log($e);
			$user = null;
		  }		
		
			if (!empty($user_profile )) {
				# User info ok? Let's print it (Here we will be adding the login and registering routines)
									
				$username = $user_profile['name'];
				$uid = $user_profile['id'];

				// save this information to db
				$user = new User();
				$user->username = $username;
				$user->email = $uid."@login.com.br";
				$user->password = md5($uid);
				$user->facebook_id = $uid;
				
				$user->zeroUniqueFacebook();
				// check if facebook_id is unique then save to db
	
				if (!isset(Yii::app()->user->id)) {
					// login automatically
					Yii::app()->user->login(UserIdentity::createAuthenticatedIdentity($user->username, $user->facebookIdToId($user->email)), 0);
					$this->redirect(Yii::app()->createUrl("/user/account"));
				}
	
				$this->redirect(Yii::app()->createUrl("/user/account"));
				
			} else {
				# For testing purposes, if there was an error, let's kill the script
				die("There was an error.");
			}
		}
	}	

	public function actionSignFacebook()
	{
		$facebook = new Facebook(array(
					'appId' => APP_ID,
					'secret' => APP_SECRET,
					));
					
		$user = $facebook->getUser();
		
		if (!$user) {	
			$this->redirect($this->FacebookLogin());
		}else{
			$this->redirect(Yii::app()->createUrl("/site/oauthfacebooklogin"));
		}
	}	
	
}