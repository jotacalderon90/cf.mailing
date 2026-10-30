
const generateTimestamp = () => {
  const now = new Date();
  return (
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  );
};

const mailing = function () {
	
	this.services = {
		templates: createService('GET', '/api/template/collection'),
		metadata: createService('GET', '/api/template/metadata/:name'),
		render: createService('POST', '/api/template/render/:name'),
		create: createService('POST', '/api/internal/mailing'),
    
		correos: createService('GET', '/api/to/correos'),
		subscritos: createService('GET', '/api/to/subscritos'),
	}

  this.newdoc = this._default();

}

mailing.prototype._default = function() {
  return {
    to: '',
    subject: '',
    type: '',
    text: '',
    template: '',
    metadata: [],
    html: ''
  }
}

mailing.prototype.start = async function (parent) {
	this.parent = parent;
  
  try {
    $('#mailing_input_richtext').summernote({
      height: 300, // Altura del editor
      minHeight: null, // Altura mínima
      maxHeight: null, // Altura máxima
      focus: true, // Enfoque automático
      lang: 'es-ES', // Idioma español
      placeholder: 'Escribe aquí...',
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture']],
        ['view', ['fullscreen', 'codeview', 'help']]
      ],
      callbacks: {
        onInit: function() {

        },
        onKeydown: function(e) {

        },
        onKeyup: function(e) {

        }
      }
    });
  }catch(error) {
		await this.parent.modal.notify('Error al cargar summernote', 'error');
		console.error(error);
  }
  
  this.canAdmin = this.parent.perfil.isAdmin();
  await this.refresh();
  
  /*********************************/
  /*20261030:Carga de datos por URL*/
  /*********************************/
  
  const to = urlParams.get('to');
  if(to && to.trim() !== '') {
    this.newdoc.to = to;
  }
  
  const subject = urlParams.get('subject');
  if(subject && subject.trim() !== '') {
    this.newdoc.subject = subject;
  }
  
  const type = urlParams.get('type');
  if(type && type.trim() !== '') {
    this.newdoc.type = type;
    
    if(type === 'template') {
      const template = urlParams.get('template');
      if(template && template.trim() !== '') {
        this.newdoc.template = template;
        await this.selectTemplate();
      }
    }
  }
  
}

mailing.prototype.refresh = async function () {
	await this.getTemplates();
}

mailing.prototype.loadCorreosEnviados = async function () {
  try {
    this.parent.loader.active = true;
    const correos = await this.services.correos();
    this.parent.loader.active = false;
    if (correos.error) {
      throw new Error(correos.error);
    }
    this.newdoc.to = correos.data;
  }catch(error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error, 'error');
    console.error(error);
  }
}

mailing.prototype.loadSubscritos = async function() {
  try {
    this.parent.loader.active = true;
    const subscritos = await this.services.subscritos();
    this.parent.loader.active = false;
    if (subscritos.error) {
      throw new Error(subscritos.error);
    }
    this.newdoc.to = subscritos.data;
  }catch(error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error, 'error');
    console.error(error);
  }
}

mailing.prototype.getTemplates = async function () {
	try {
    this.parent.loader.active = true;
		const templates = await this.services.templates();
    this.parent.loader.active = false;
		if (templates.error) {
			throw new Error(templates.error);
		}
		this.templates = templates.data;
	} catch (error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error, 'error');
    console.error(error);
	}
}

mailing.prototype.selectTemplate = async function(){
	try{		
		this.parent.loader.active = true;
		const respuesta = await this.services.metadata({name: this.newdoc.template});
		this.parent.loader.active = false;
		if(respuesta.error){
			throw new Error(respuesta.error)
		}
		this.newdoc.metadata = respuesta.data;

    if (this.newdoc.metadata.some(row => row.label === 'html')) {
      await this.parent.modal.notify('La plantilla tiene un atributo llamado HTML que causará problemas, avise al Informático', 'error');
    }

	} catch (error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error, 'error');
    console.error(error);
	}
}

mailing.prototype.render = async function() {
  try{		
		this.parent.loader.active = true;
		const respuesta = await this.services.render({name: this.newdoc.template}, this.newdoc.metadata.reduce((acc, item) => {
      acc[item.label] = item.value;
      return acc;
    }, {}));
		this.parent.loader.active = false;
		if(respuesta.error){
			throw new Error(respuesta.error)
		}
		this.newdoc.html = respuesta.data;
    $('#dvRender').html(this.newdoc.html);
	} catch (error) {
		this.parent.loader.active = false;
    await this.parent.modal.notify(error, 'error');
    console.error(error);
	}
}

mailing.prototype.preenviar = async function() {
  try{
    
    const emails = this.newdoc.to.split(',');
    
    for(let i=0;i<emails.length;i++) {
      if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emails[i])) {
        this.parent.modal.notify('email inválido', 'error');
        return;
      }
    }
    
    let campaign = '';
    if(emails.length > 1) { 
      const confirmaGenerarId = await this.parent.modal.confirm('¿Desea generar un id único para todos los correos?');
      if(confirmaGenerarId) {
        campaign = generateTimestamp();
      }
    }
    
    await wait(500);
    
    const confirm = await this.parent.modal.confirm('Confirme envío para ' + emails.length + ' destinatarios');
    if(!confirm) {
      return;
    }
    
    let body = {
      campaign: campaign
    };
    
    switch (this.newdoc.type) {
      case 'plain':
        body.html = '<html><body><p>' + this.newdoc.text + '</p></body></html>'
        break;
      case 'richtext':
        body.html = $('#mailing_input_richtext').summernote('code');
        break;
      case 'template':
        body.template = this.newdoc.template;
        body = {
          ...body,
          ...this.newdoc.metadata.reduce((acc, item) => {
            acc[item.label] = item.value;
            return acc;
          }, {})
        }
        break;
    }
    
    this.parent.loader.active = true;
    
    const errores = [];
    
    for(let i=0;i<emails.length;i++) {
      
      this.parent.loader.title = i + '/' + emails.length;
      
      const nuevoMailing = {
        email: emails[i],
        subject: this.newdoc.subject,
        ...body
      };
      
      const respuesta = await this.services.create({},nuevoMailing);
      
      if(respuesta.error || respuesta.data != true) {
        errores.push(respuesta.error + ' (' + emails[i] + ')');
      }
      
    }
    
    this.parent.loader.active = false;
    
    if(errores.length > 0) {
      this.parent.modal.notify(errores.join(', '), 'error');
    } else {
      
      location.href = '/';
    }
    
	} catch (error) {
		this.parent.loader.active = false;
    await this.parent.modal.notify(error, 'error');
    console.error(error);
	}
}

app.modules.mailing = mailing;