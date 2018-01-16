//DELETE Functionality

//$ query selector / jquery functions
$(document).ready(function(){
    $('.delete-blogpost').on('click',function(e){
        //the component which triggered the click event
        $target = $(e.target);
        //the attribute with name 'data-id'
        const id = $target.attr('data-id');

        $.ajax({
            type: 'DELETE',
            //delete route
            url: '/blogposts/'+id,
            success: function(response){
                alert('Deleting Blogpost');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});