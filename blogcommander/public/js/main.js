//$ query selector / jquery functions
$(document).ready(function(){
    $('.delete-blogpost').on('click',function(e){
        $target = $(e.target);
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