{
  const profileName = document.getElementById('profile-name');

  document.addEventListener('DOMContentLoaded', event => {
    fetch('php/middle.php?endpoint=self.php')
      .then(response => response.json())
      .then(json => {
        profileName.innerHTML = json.username;
      })
      .catch(err => alert(err));
  });
}
