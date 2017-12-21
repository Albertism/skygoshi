/**
 * Created by berti on 12/2/2017.
 */
var homeAjax = function () {
    $('document').ready(function () {
        //jquery UI date picker
        $("#jsDatePicker").datepicker();

        //set the default date value to be today
        var dateString = new Date().toISOString().slice(0,10);
        $('#jsDatePicker').val(dateString);

        getScope('homeController').$apply(function(){
            getScope('homeController').model.pickedDate = dateString;
        });

        //on update set angular variable so UI can be updated
        $("#fileUpload").change(function(){
            getScope('homeController').$apply(function(){
                getScope('homeController').model.fileLoaded = true;
            });
        });

        //stops default form action (so that it doesn't reload page) and manually handle ajax
        //on success, set angular variables for further csv parsing
        $("#csvForm").submit(function(event) {

            var formData = new FormData();
            formData.append("myFile", $('[name="myFile"]')[0].files[0]);
            event.stopPropagation();
            event.preventDefault();
            $.ajax({
                url: $(this).attr("action"),
                data: formData,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function(response) {
                    getScope('homeController').$apply(function(){
                        getScope('homeController').model.uploadedPath = response.path;
                    });
                }
            });
            return false;
        });
    });

    // helper function for jquery to access angular controller's scope
    function getScope(ctrlName) {
        var sel = 'div[ng-controller="' + ctrlName + '"]';
        return angular.element(sel).scope();
    }
};