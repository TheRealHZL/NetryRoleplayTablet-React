import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Phone, Mail, User, Shield, UserPlus, UserMinus, Filter } from 'lucide-react';
import './css/EmployeeList.css';

const EmployeeList = () => {
  // State declarations
  const [employees, setEmployees] = useState([]);
  const [playerJob, setPlayerJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Jobs color classes
  const jobColors = {
    'police': 'job-color-police',
    'ambulance': 'job-color-ambulance',
    'mechanic': 'job-color-mechanic',
    'default': 'job-color-default'
  };

  // FiveM NUI API Wrapper
  const fetchNui = async (eventName, data = {}) => {
    try {
      const resp = await fetch(`https://netry_Tablet/${eventName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
      });
      return await resp.json();
    } catch (error) {
      console.error(`Error in NUI callback ${eventName}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Detect if we're in a FiveM environment (window.invokeNative will exist)
        const isFiveM = 'invokeNative' in window || window.location.protocol === 'nui:';
        
        if (isFiveM) {
          // Get player job data
          const jobResponse = await fetchNui('getPlayerJobEmployeeList');
          
          if (jobResponse.status === 'success') {
            setPlayerJob(jobResponse.data);
            
            // Get employees for this job
            const employeesResponse = await fetchNui('getEmployees', { job: jobResponse.data.id });
            
            if (employeesResponse.status === 'success') {
              setEmployees(employeesResponse.data);
            } else {
              console.error('Failed to fetch employees:', employeesResponse.message);
              setEmployees([]);
            }
          } else {
            console.error('Failed to fetch job data:', jobResponse.message);
          }
        } else {
          // Test data for development outside FiveM
          console.log('Using sample data for development (not in FiveM environment)');
          setPlayerJob({ id: 'police', label: 'Polizei' });
          setEmployees([
            { id: 1, name: 'Max Schmidt', job_grade: 'Chef', phone: '555-123-4567', email: 'max.schmidt@example.com' },
            { id: 2, name: 'Anna Müller', job_grade: 'Stellvertreter', phone: '555-234-5678', email: 'anna.mueller@example.com' },
            { id: 3, name: 'Thomas Weber', job_grade: 'Senior', phone: '555-345-6789', email: 'thomas.weber@example.com' },
            { id: 4, name: 'Laura Fischer', job_grade: 'Junior', phone: '555-456-7890', email: 'laura.fischer@example.com' },
            { id: 5, name: 'Jan Becker', job_grade: 'Praktikant', phone: '555-567-8901', email: 'jan.becker@example.com' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to empty state on error
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add a function to exit the NUI (close the tablet)
  const closeTablet = () => {
    try {
      if ('invokeNative' in window) {
        // Send a message to exit the NUI
        fetchNui('closeTablet');
      }
    } catch (error) {
      console.error('Error closing tablet:', error);
    }
  };

  // Sorting and filtering functions
  const filteredEmployees = employees
    .filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(emp => filter === 'all' || emp.job_grade === filter)
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'job_grade') {
        comparison = a.job_grade.localeCompare(b.job_grade);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Get all unique job grades for filter dropdown
  const jobGrades = ['all', ...new Set(employees.map(emp => emp.job_grade))];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleClose = () => {
    setSelectedEmployee(null);
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterSelect = (gradeFilter) => {
    setFilter(gradeFilter);
    setShowFilterDropdown(false);
  };

  // Job specific color
  const getJobColor = () => {
    if (!playerJob) return jobColors.default;
    return jobColors[playerJob.id] || jobColors.default;
  };

  // Localized job name
  const getJobName = () => {
    if (!playerJob) return 'Laden...';
    return playerJob.label || playerJob.id.charAt(0).toUpperCase() + playerJob.id.slice(1);
  };

  // Handle employee phone call
  const handleCallEmployee = (phone) => {
    try {
      if ('invokeNative' in window) {
        fetchNui('callNumber', { number: phone });
      } else {
        console.log('Call employee:', phone);
      }
    } catch (error) {
      console.error('Error calling employee:', error);
    }
  };

  // Handle send message to employee
  const handleMessageEmployee = (phone) => {
    try {
      if ('invokeNative' in window) {
        fetchNui('sendMessage', { number: phone });
      } else {
        console.log('Message employee:', phone);
      }
    } catch (error) {
      console.error('Error messaging employee:', error);
    }
  };

  return (
    <div className="employee-list-container">
      {/* Header with job title */}
      <div className="header">
        <div className="job-indicator">
          <div className={`job-dot ${getJobColor()}`}></div>
        </div>
        <h1 className="title">
          {getJobName()} - Mitarbeiterübersicht
        </h1>
      </div>

      {/* Search bar and filter */}
      <div className="controls">
        <div className="search-container">
          <div className="search-icon">
            <Search size={20} />
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Nach Mitarbeiter suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-container">
          <button 
            className="filter-button"
            onClick={toggleFilterDropdown}
          >
            <Filter size={16} />
            <span>{filter === 'all' ? 'Alle Ränge' : filter}</span>
            <ChevronDown size={16} className={showFilterDropdown ? 'rotate' : ''} />
          </button>
          
          {showFilterDropdown && (
            <div className="filter-dropdown">
              {jobGrades.map((grade) => (
                <button
                  key={grade}
                  className="filter-option"
                  onClick={() => handleFilterSelect(grade)}
                >
                  {grade === 'all' ? 'Alle Ränge' : grade}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        // Loading state
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Mitarbeiterdaten werden geladen...</p>
        </div>
      ) : selectedEmployee ? (
        // Detail view for selected employee
        <div className="employee-detail">
          <div className="detail-header">
            <div className="employee-avatar-large">
              <div className={`avatar-circle ${getJobColor()}`}>
                <User size={32} />
              </div>
              <div className="employee-info">
                <h2 className="employee-name">{selectedEmployee.name}</h2>
                <div className="employee-rank">
                  <Shield size={16} />
                  <span>{selectedEmployee.job_grade}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="close-button"
            >
              &times;
            </button>
          </div>
          
          <div className="detail-grid">
            <div className="detail-card">
              <h3 className="card-title">Kontaktinformationen</h3>
              <div className="contact-info">
                <div className="info-row">
                  <Phone size={16} className="info-icon" />
                  <span>{selectedEmployee.phone}</span>
                </div>
                <div className="info-row">
                  <Mail size={16} className="info-icon" />
                  <span>{selectedEmployee.email}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-card">
              <h3 className="card-title">Dienstinformationen</h3>
              <div className="service-info">
                <div className="info-item">
                  <span className="info-label">Rang:</span>
                  <span>{selectedEmployee.job_grade}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Abteilung:</span>
                  <span>{getJobName()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="action-button call-button"
              onClick={() => handleCallEmployee(selectedEmployee.phone)}
            >
              <Phone size={16} />
              Anrufen
            </button>
            <button 
              className="action-button message-button"
              onClick={() => handleMessageEmployee(selectedEmployee.phone)}
            >
              <Mail size={16} />
              Nachricht
            </button>
          </div>
        </div>
      ) : (
        // Employee list
        <div className="employee-table-container">
          <div className="table-scroll">
            <table className="employee-table">
              <thead>
                <tr>
                  <th className="sortable-header" onClick={() => handleSort('name')}>
                    <div className="header-content">
                      Name
                      {sortBy === 'name' && (
                        <ChevronDown size={16} className={sortOrder === 'desc' ? 'rotate' : ''} />
                      )}
                    </div>
                  </th>
                  <th className="sortable-header" onClick={() => handleSort('job_grade')}>
                    <div className="header-content">
                      Rang
                      {sortBy === 'job_grade' && (
                        <ChevronDown size={16} className={sortOrder === 'desc' ? 'rotate' : ''} />
                      )}
                    </div>
                  </th>
                  <th>
                    Kontakt
                  </th>
                  <th>
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr 
                      key={employee.id} 
                      className="employee-row"
                      onClick={() => handleEmployeeSelect(employee)}
                    >
                      <td>
                        <div className="employee-name-cell">
                          <div className={`avatar-circle-small ${getJobColor()}`}>
                            <User size={16} />
                          </div>
                          <span className="employee-cell-name">{employee.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="rank-badge">
                          {employee.job_grade}
                        </span>
                      </td>
                      <td>
                        <div className="contact-icons">
                          <Phone 
                            size={16} 
                            className="contact-icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCallEmployee(employee.phone);
                            }}
                          />
                          <Mail 
                            size={16} 
                            className="contact-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMessageEmployee(employee.phone);
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <button className="details-button">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-message">
                      Keine Mitarbeiter gefunden
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status bar */}
      <div className="status-bar">
        <div className="employee-count">
          {filteredEmployees.length} Mitarbeiter angezeigt
        </div>
        <div className="action-links">
          <button 
            className="action-link"
            onClick={() => fetchNui('addEmployee', { job: playerJob?.id })}
          >
            <UserPlus size={16} />
            Hinzufügen
          </button>
          <button 
            className="action-link"
            onClick={() => fetchNui('removeEmployee', { job: playerJob?.id })}
          >
            <UserMinus size={16} />
            Entfernen
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;