document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
      document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });