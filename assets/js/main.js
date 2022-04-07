document.addEventListener("DOMContentLoaded", function(el) {
  var searchActivitiesForm = document.forms['searchActivities'];

  if (searchActivitiesForm) {
    document.getElementById("exportBtn").addEventListener("click", function(ec) {
      searchActivitiesForm['export'].value = 'true';
      searchActivitiesForm.submit();
    })

    document.getElementById("searchBtn").addEventListener("click", function(ec) {
      searchActivitiesForm['export'].value = '';
      searchActivitiesForm.submit();
    })
  }

  document.querySelectorAll('.type').forEach(function(item) {
    type = item.innerHTML;
    item.innerHTML = '<img src="assets/images/' + type + '-icon.png" />';
  });

  document.querySelectorAll('.date').forEach(function(item) {
    date = new Date(item.innerHTML);
    item.innerHTML = date.toLocaleString('fr-FR');
  });

  document.querySelectorAll('.time').forEach(function(item) {
    time = eval(item.innerHTML)*60*1000;
    dTime = new Date(time).toISOString().slice(11, -5);
    item.innerHTML = dTime;
  });

  document.querySelectorAll('.distance').forEach(function(item) {
    distance = item.innerHTML.replace('.', ',');
    item.innerHTML = distance + 'kms';
  });

  document.querySelectorAll('.speed').forEach(function(item) {
    speed = item.innerHTML.replace('.', ',');
    item.innerHTML = speed + 'km/h';
  });
});
