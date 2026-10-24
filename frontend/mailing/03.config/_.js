const config = function () {
	
	this.services = {
		read: createService('GET', '/api/config/smtp'),
		update: createService('PUT', '/api/config/smtp')
	}

  this.doc = {
    host: '',
    secureconnection: false,
    port: 0,
    user: '',
    password: '',
    from: '',
    bcc: ''
  };
  
}

config.prototype.start = async function (parent) {
	this.parent = parent;
  await this.read();
}

config.prototype.read = async function (parent) {
  try {
    
    this.parent.loader.active = true;
    const doc = await this.services.read();
    this.parent.loader.active = false;
    
    if(doc.error) {
      throw new Error(doc.error);
    }
    
    this.doc = doc.data;
    
  }catch(error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error, 'error');
    console.error(error);
  }
}

config.prototype.update = async function() {
  try {
    
    const confirmar = await this.parent.modal.confirm('Confirme guardar', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
    this.parent.loader.active = true;
    const response = await this.services.update({},{config: this.doc});
    this.parent.loader.active = false;
    
    if(response.error) {
      throw new Error(response.error);
    }
    
    if(response.data) {
      location.reload();
    }
    
    
  }catch(error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error, 'error');
    console.error(error);
  }
}

app.modules.config = config;