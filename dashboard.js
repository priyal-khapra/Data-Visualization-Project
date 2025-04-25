function loadDashboard(dataType, userType) {
    const iframe = document.getElementById('dashboard-iframe');
  
    let page = '';
  
    if (dataType === 'daily' && userType === 'self') {
      page = 'daily_self.html';
    } 
    else if (dataType === 'daily' && userType === 'top') {
      page = 'daily_top_perfomer.html';
    } 
    else if (dataType === 'monthly' && userType === 'self') {
      page = 'self.html';
    } 
    else if (dataType === 'monthly' && userType === 'top') {
      page = 'top_performer.html';
    }
    else if (dataType === 'weekly' && userType === 'top') {
      page = 'weekly_top_performer.html';
    }
    else if (dataType === 'weekly' && userType === 'self') {
      page = 'weekly_self.html';
    }
  
    iframe.src = page;
  }
  
  // Set up listeners
  document.getElementById('data-type').addEventListener('change', () => {
    const dataType = document.getElementById('data-type').value;
    const userType = document.getElementById('user-type').value;
    loadDashboard(dataType, userType);
  });
  
  document.getElementById('user-type').addEventListener('change', () => {
    const dataType = document.getElementById('data-type').value;
    const userType = document.getElementById('user-type').value;
    loadDashboard(dataType, userType);
  });
  
  // Initial load
  window.onload = () => {
    loadDashboard('daily', 'self');
  };
  