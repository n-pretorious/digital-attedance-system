//scripts to enable selects and other custom scripts
$(document).ready(function () {
  $('select').each(function () {
    $(this).select2({
      theme: 'bootstrap4',
      width: 'style',
      placeholder: $(this).attr('placeholder'),
      allowClear: Boolean($(this).data('allow-clear')),
    });
  });

  var NewUnitCodeField = document.getElementById('NewUnitCodeField');
  var NewUnitNameField = document.getElementById('NewUnitNameField');

  document.getElementById('resetUnitsButton').addEventListener('click', function () {
      NewUnitCodeField.value="";
      NewUnitNameField.value="";
  })
});