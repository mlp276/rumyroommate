const form = document.getElement('post')
const postTitle_input = document.getElementById('postTitle-input') 
const address_input = document.getElementById('address-input') 
const campus_input = document.getElementById('campus-input') 
const roomnum_input = document.getElementById('roomnum-input') 
const roomates_input = document.getElementById('roomates-input') 

form.addEventListener('submit', (e)=>{
    let errors=[]
    errors= getCreatePostErrors(postTitle_input.val,address_input.val,roomnum_input.val);
})
function getCreatePostErrors(postTtile, address)
{
    if(postTitle === '' || postTitle == null){
        errors.push('A Title is Required! Let us know what you are looking for in this posting <3')
        postTitle_input.parentElement.classList.add('incorrect')
    }
    if(address === '' || address == null){
        errors.push('This is required!')
        address_input.parentElement.classList.add('incorrect')
    }
}
function previewImage() {
    const file = document.getElementById('imageInput').files[0];
    const reader = new FileReader();
    reader.onloadend = function() {
      document.getElementById('user-image').src = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }
