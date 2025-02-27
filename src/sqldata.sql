CREATE TABLE IF NOT EXISTS medical_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizenid INT NOT NULL,
    title VARCHAR(100) NOT NULL DEFAULT "Neuer Medizinischer Eintrag",
    description TEXT NOT NULL DEFAULT "Automatisch erstellt",
    diagnosis TEXT DEFAULT NULL,
    treatment TEXT DEFAULT NULL,
    prescribed_medication TEXT DEFAULT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL DEFAULT "System",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizenid) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS medical_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizenid INT NOT NULL,
    note TEXT NOT NULL,
    created_by VARCHAR(100) NOT NULL DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizenid) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS medical_information (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizenid INT NOT NULL,
    medication VARCHAR(255) DEFAULT NULL,
    dosage VARCHAR(50) DEFAULT NULL,
    treatment TEXT DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizenid) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS medical_psychological_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizenid INT NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment TEXT DEFAULT NULL,
    risk_assessment TEXT DEFAULT NULL,
    created_by VARCHAR(100) NOT NULL DEFAULT "System",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizenid) REFERENCES users(id) ON DELETE CASCADE
);



CREATE TABLE IF NOT EXISTS police_and_justice_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    citizenid INT NOT NULL,
    title VARCHAR(100) NOT NULL DEFAULT "Neuer Polizeilicher Eintrag",
    description TEXT NOT NULL DEFAULT "Automatisch erstellt",
    offense TEXT DEFAULT NULL,
    penalty TEXT DEFAULT NULL,
    officer VARCHAR(100) NOT NULL DEFAULT "Unbekannt",
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) NOT NULL DEFAULT "System",
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizenid) REFERENCES users(id) ON DELETE CASCADE
);
