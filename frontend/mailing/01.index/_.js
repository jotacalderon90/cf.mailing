const mailing = function () {
	
  this.query = {};
	
	this.services = {
		total: createService('GET', '/api/mailing/total?to=:to'),
		collection: createService('GET', '/api/mailing/collection?skip=:skip&sort_field=:sort_field&sort_type=:sort_type&to=:to'),
		read: createService('GET', '/api/mailing/:id'),
		delete: createService('DELETE', '/api/mailing/:id'),
    loadSeen: createService('GET', '/api/seen/:hash/collection'),
	}

	this.coll = [];
  
	this.filterText = '';
  this.filterTextInput = null;
  this.sort_field = '';
  this.sort_type = 1;
  
  this.filterByField = {
    to: ''
  }
}

mailing.prototype.start = async function (parent) {
	this.parent = parent;
  
  this.canAdmin = this.parent.perfil.isAdmin();
  this.host_database = this.parent.menu.getHost('database');
  this.can_goto_database = this.canAdmin || this.parent.perfil.hasRole(this.host_database.defaultRoles);
    
  this.refresh();
}

mailing.prototype.refresh = async function () {
	this.cant = 0;
	this.obtained = 0;
  this.sort_field = '';
  this.sort_type = 1;
  this.filterByField.to = '';
	this.coll = [];
	await this.getTotal();
}

mailing.prototype.getTotal = async function () {
	try {
		const cant = await this.services.total({
      to: this.filterByField.to
    });
		if (cant.error) {
			throw new Error(cant.error);
		}
		this.cant = cant.data;
		this.getCollection();
	} catch (error) {
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

mailing.prototype.getCollection = async function () {
	try {
    this.parent.loader.active = true;
		const coll = await this.services.collection({
      skip: this.obtained,
      sort_field: this.sort_field,
      sort_type: this.sort_type,
      to: this.filterByField.to
    });
		this.parent.loader.active = false;
    if (coll.error) {
			throw new Error (coll.error);
		}
		this.coll = this.coll.concat(coll.data.map((row)=>{ return this.formatToClient(row)}));
		this.obtained = this.coll.length;
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

mailing.prototype.sort = async function(sort_field) {
  this.obtained = 0;
  this.coll = [];
  this.sort_field = sort_field;
  this.sort_type = this.sort_type * -1;
  await this.getCollection();
}

mailing.prototype.formatToClient = function(row) {
  const dtUTC = luxon.DateTime.fromISO(row.created, { zone: "utc" });
  row.created_formatted = dtUTC.setZone(timezone).toFormat('dd/MM/yyyy HH:mm:ss');
  row.link_host_database = this.host_database.host + '/objetos/mailing/' + row.id;
  return row;
}

mailing.prototype.getCollectionView = function () {
  if (!this.filterText) return this.coll;
  const filter = this.filterText.toLowerCase();
  return this.coll.filter(row =>
    (row.to && row.to.toLowerCase().includes(filter)) ||
    (row.subject && row.subject.toLowerCase().includes(filter))||
    (row.origin && row.origin.toLowerCase().includes(filter))||
    (row.campaign && row.campaign.includes(filter))
  );
}

mailing.prototype.read = async function (id) {
	try {
    this.parent.loader.active = true;
		const read = await this.services.read({id: id});
		this.parent.loader.active = false;
		if (read.error) {
			throw new Error (read.error);
		}
    this.parent.modal.displayHtml(read.data.subject, read.data.html);
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

mailing.prototype.delete = async function(id) {
	try {
    if(!confirm('Confirme eliminación del registro')) {
      return;
    }
    this.parent.loader.active = true;
		const respuesta = await this.services.delete({id: id});
    this.parent.loader.active = false;
		if (respuesta.error) {
			throw new Error (respuesta.error);
		}
    if(!respuesta.data) {
      throw new Error(respuesta.data);
    }
    this.refresh();
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

mailing.prototype.selectRegistro = function(registro) {
  if(registro.isSelected){
    registro.isSelected = false;
    registro._class = '';
  }else{
    registro.isSelected = true;
    registro._class = 'table-warning';
  }
}

mailing.prototype.getSelectedRegistros = function() {
  return this.getCollectionView().filter((r)=>{
    return r.isSelected;
  })
}

mailing.prototype.deleteRegistros = async function() {
	try {
    
    const selected = this.getSelectedRegistros();
    
    const confirmar = await this.parent.modal.confirm('Confirme eliminación de ' + selected.length + ' registros', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		this.parent.loader.active = true;
		for (let i = 0; i < selected.length; i++) {
			const repuesta = await this.services.delete({
				id: selected[i].id
			});
			if (repuesta.error) {
				throw new Error(repuesta.error);
			}
		}
		this.parent.loader.active = false;
		location.reload();
	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

mailing.prototype.loadSeen = async function(row){
	try {
    
		this.parent.loader.active = true;
		const respuesta = await this.services.loadSeen({
      hash: row.hash
    });
		if (respuesta.error) {
      throw new Error(respuesta.error);
    }
		this.parent.loader.active = false;
    this.seen = respuesta.data.map((docSeen)=>{
      const dtUTC = luxon.DateTime.fromISO(docSeen.created, { zone: "utc" });
      docSeen.created_formatted = dtUTC.setZone(timezone).toFormat('dd/MM/yyyy HH:mm:ss');
      return docSeen;
    });
    this.parent.modal.open('mdSeen');
	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

mailing.prototype.copyCampaign = function(campaign){
  this.filterText = campaign;
  this.filterTextInput?.focus();
}

mailing.prototype.openFilter = function() {
  this.parent.modal.open('mdFilter');
}

mailing.prototype.filter = async function() {
  this.cant = 0;
	this.obtained = 0;
  this.sort_field = '';
  this.sort_type = 1;
	this.coll = [];
  this.parent.modal.close('mdFilter');
	await this.getTotal();
}

app.modules.mailing = mailing;