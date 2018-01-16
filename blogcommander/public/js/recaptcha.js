//document.getElementById('registerForm').addEventListener('submit',submitForm);
//   
//   function submitForm(e){
//    e.preventDefault();
//    
//    const captcha = document.querySelector('#g-recaptcha-response').value;
//    console.log(captcha);
//
//    fetch('/users/register', {
//        method:'POST',
//        headers: {
//            'Accept': 'application/json, text/plain, */*',
//            'Content-type': 'application/json'
//        },
//        body:JSON.stringify({captcha: captcha})
//    });
//}


$(document).ready(function(){
    $('#registerForm').on('submit',function(e){
        e.preventDefault();
        const captcha = $('#g-recaptcha-response').val();
        const name = $('#name').val();
        const email = $('#email').val();
        const username = $('#username').val();
        const password = $('#password').val();
        const password2 = $('#password2').val();

        $.ajax({
            type: 'POST',
            url: '/users/register',
            //dataType: 'application/json',
            data: {'captcha':captcha,
                    'name':name,
                    'email':email,
                    'username':username,
                    'password':password,
                    'password2':password2
                },
            //treat response codes here - do messaging etc.
            success: function(xhr,status,response){
                alert('User registration completed successfully');
                window.location.href='/';
            },
            error: function(xhr,status,error){
                alert(xhr.responseText);
            }
        });
    });
});