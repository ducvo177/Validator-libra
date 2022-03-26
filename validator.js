//Đối tượng Validator
function Validator(options) {
    var selectorRules={
    
    };
  
  //Hàm thực hiện validate
    function validate(inputElement,rule){
    var errorMessage;
    var errorElement=inputElement.parentNode.querySelector(options.errorSelector);    
    //Lấy ra các rule của selector   
    var rules=selectorRules[rule.selector];       
    //Lặp ra từng rule và kiểm tra
    //Nếu có lỗi thì dừng kiểm tra
    for(var i=0;i < rules.length;++i){
       errorMessage= rules[i](inputElement.value);
       if(errorMessage) break;
    }
    if(errorMessage){
        errorElement.innerText=errorMessage;
        inputElement.parentElement.classList.add('invalid')
       
    }else{
        errorElement.innerText='';
        inputElement.parentElement.classList.remove('invalid')

    }
    return!! errorMessage;
   }


//Lấy elements của form cần validate
    var formElement=document.querySelector(options.form)
    if(formElement){    
        //Khi submit form
        formElement.onsubmit=function(e){
            e.preventDefault();
            var isFormValid= true;
            //Lặp qua từng rule và validate 
            options.rules.forEach(function(rule){
                var inputElement= formElement.querySelector(rule.selector);
                var isValid=validate(inputElement,rule)
                if(!isValid){
                    isFormValid=false;
                }
            });
           
           
            if(isFormValid){
                //Trường hợp submit với javascript
                if(typeof options.onSubmit==='function'){
                    var enableInputs=formElement.querySelectorAll('[name]');
                    var formValues=Array.from(enableInputs).reduce(function(values,input){
                    values[input.name]=input.value ;
                     return values;
                  
                  },{});
                    options.onSubmit(formValues);
                    
                }
            }else{
               formElement.submit();
            }
            
        }
        //Lặp qua mỗi rule và xử lý
        options.rules.forEach(function(rule){
            var inputElement= formElement.querySelector(rule.selector);
            //Lưu lại rule cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push( rule.test)
            }else{
            selectorRules[rule.selector]=[rule.test]
            }
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
Validator.minLength= function(selector){
    return{
        selector:selector,
        test: function(value){
             var length=6;
             if(value.length<length){
                 return "Vui lòng nhập mật khẩu dài hơn 6 ký tự";
             }
        }
    }
}
Validator.isComfirmed = function(selector,getConfirmValue,message){
    return{
        selector:selector,
        test: function(value){
      return value===getConfirmValue() ? message : "Giá trị nhập vào không chính xác";
        }
    }
}