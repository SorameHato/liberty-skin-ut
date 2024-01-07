// eslint-disable-next-line
function LoginManage() {
	'use strict';
	mw.loader.using( 'mediawiki.api' ).then(function() {
		try {
			// new mw.Api().postWithToken does not work with clientlogin
			var api = new mw.Api();
			api.post( {
				action: 'query',
				meta: 'tokens',
				type: 'login'
			} )
				.then( function ( result ) {
					var token = result.query.tokens.logintoken;
					return api.post( {
						action: 'clientlogin',
						loginreturnurl: location.href,
						username: $( '#wpName1' ).val(),
						password: $( '#wpPassword1' ).val(),
						rememberMe: $( '#lgremember' ).prop( 'checked' ) ? 1 : 0,
						logintoken: token
					} )
				} )
				.then( function ( result ) {
					/* Error response:
     					{
					    "error": {
					        "code": "writeapidenied",
					        "info": "You're not allowed to edit this wiki through the API.",
					        "*": "See http://ut.run.goorm.io/api.php for API usage. Subscribe to the mediawiki-api-announce mailing list at &lt;https://lists.wikimedia.org/postorius/lists/mediawiki-api-announce.lists.wikimedia.org/&gt; for notice of API deprecations and breaking changes."
					    }
					} */
					if ( result.clientlogin.status !== 'PASS' ) {
						switch ( result.clientlogin.status ) {
							case 'FAIL':
								$( '#modal-login-alert' ).addClass( 'alert-warning' );
								$( '#modal-login-alert' ).fadeIn( 'slow' );
								$( '#modal-login-alert' ).text( result.clientlogin.message );
								break;
							case 'REDIRECT':
								$( '#modal-login-alert' ).addClass( 'alert-warning' );
								$( '#modal-login-alert' ).fadeIn( 'slow' );
								$( '#modal-login-alert' ).text( '리다이렉트는 미구현 상태입니다. 해당 상태코드가 발생한 경우 아래의 \'다른 방법으로 로그인하기\'를 클릭해 로그인해주세요.' );
								break;
							case 'UI':
								$( '#modal-login-alert' ).addClass( 'alert-warning' );
								$( '#modal-login-alert' ).fadeIn( 'slow' );
								$( '#modal-login-alert' ).text( 'UI는 미구현 상태입니다. 해당 상태코드가 발생한 경우 아래의 \'다른 방법으로 로그인하기\'를 클릭해 로그인해주세요.' );
								break;
							case 'RESTART':
								$( '#modal-login-alert' ).addClass( 'alert-warning' );
								$( '#modal-login-alert' ).fadeIn( 'slow' );
								$( '#modal-login-alert' ).text( 'RESTART는 미구현 상태입니다. 해당 상태코드가 발생한 경우 아래의 \'다른 방법으로 로그인하기\'를 클릭해 로그인해주세요.' );
								break;
							case 'writeapidenied':
								$( '#modal-login-alert' ).addClass( 'alert-warning' );
								$( '#modal-login-alert' ).fadeIn( 'slow' );
								$( '#modal-login-alert' ).text( 'API 요청이 거절당했습니다. 해당 상태코드가 발생한 경우 아래의 \'다른 방법으로 로그인하기\'를 클릭해 로그인해주세요.' );
								break;
							default:

						}
					} else {
						if ( mw.config.get( 'wgNamespaceNumber' ) === -1 ) {
							$( location ).attr( 'href', mw.config.get( 'wgArticlePath' ).replace( '$1', '' ) );
						} else {
							window.location.reload();
						}
					}
				} )
				.catch( function () {} );
			return false;
		} catch ( e ) {
			return false;
		}
	});
}

$( function () {
	$( '#modal-loginform' ).on( {
		keypress: function ( e ) {
			if ( e.which === 13 /* Enter was pressed */ ) {
				e.preventDefault();
				return LoginManage();
			}
		},
		submit: function ( e ) {
			e.preventDefault();
			return LoginManage();
		}
	} );
} );
