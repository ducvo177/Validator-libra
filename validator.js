//Đối tượng Validator
function Validator(options) {
  
  //Hàm thực hiện validate
    function validate(inputElement,rule){
    var errorMessage= rule.test(inputElement.value);
    var errorElement=inputElement.parentNode.querySelector(options.errorSelector);              
                   
    if(errorMessage){
        errorElement.innerText=errorMessage;
        inputElement.parentElement.classList.add('invalid')
       
    }else{
        errorElement.innerText='';
        inputElement.parentElement.classList.remove('invalid')

    }
   }


//Lấy elements của form cần validate
    var formElement=document.querySelector(options.form)
    if(formElement){
        options.rules.forEach(function(rule){
            var inputElement= formElement.querySelector(rule.selector);
         
            if(inputElement){
                //Xử lý trường hợp blur
                inputElement.onblur= function(){
                    validate(inputElement,rule)
                }
                //Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput= function(){
                    var errorElement=inputElement.parentNode.querySelector(options.errorSelector);    
                    errorElement.innerText='';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }

}
//Định nghĩa Rules
//1 Khi có lỗi thì trả ra message lỗi
//Không có lỗi,không trả ra gì cả
Validator.isRequired = function(selector){
    return {
        selector:selector,
        test: function(value){
          return value.trim()? undefined :'Vui lòng nhập trường này'
     
        }
    };
}
Validator.isEmail = function(selector){
   return {
        selector:selector,
        test: function(value){
            var regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ?  undefined : "Vui lòng nhập email"
        }
    };
}