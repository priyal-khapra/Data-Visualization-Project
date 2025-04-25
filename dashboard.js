// Function to load the appropriate dashboard page based on selected data type and user type
function loadDashboard(dataType, userType) {
    const iframe = document.getElementById('dashboard-iframe'); // Get the iframe element where the dashboard will load
  
    let page = ''; // Variable to store the selected page
    // Determine the appropriate HTML file to load based on the combination of dataType and userType
    if (dataType === 'daily' && userType === 'self') {
      page = 'daily_self.html'; // Daily data for the current user
    } 
    else if (dataType === 'daily' && userType === 'top') {
      page = 'daily_top_perfomer.html'; // Daily data for top performers
    } 
    else if (dataType === 'monthly' && userType === 'self') {
      page = 'self.html'; // Monthly data for the current use
    } 
    else if (dataType === 'monthly' && userType === 'top') {
      page = 'top_performer.html'; // Monthly data for top performers
    }
    else if (dataType === 'weekly' && userType === 'top') {
      page = 'weekly_top_performer.html'; // Weekly data for top performers
    }
    else if (dataType === 'weekly' && userType === 'self') {
      page = 'weekly_self.html'; // Weekly data for the current user
    }
    // Set the iframe source to the determined page
    iframe.src = page;
  }
  
  // Set up listeners for changes to the data type dropdown
  document.getElementById('data-type').addEventListener('change', () => {
    const dataType = document.getElementById('data-type').value;
    const userType = document.getElementById('user-type').value;
    loadDashboard(dataType, userType);
  });
  // Event listener for changes to the user type dropdown
  document.getElementById('user-type').addEventListener('change', () => {
    const dataType = document.getElementById('data-type').value;
    const userType = document.getElementById('user-type').value;
    loadDashboard(dataType, userType);
  });
  
  // Initial load// Initial page load: default to daily data for the current user
  window.onload = () => {
    loadDashboard('daily', 'self');
  };
  