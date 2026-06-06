import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ExpandableScreen,
  ExpandableScreenTrigger,
  ExpandableScreenContent,
} from './ui/ExpandableScreen';
import {
  Expandable,
  ExpandableContent,
  ExpandableTrigger,
} from './ui/expandable';
import {
  FloatingPanelRoot,
  FloatingPanelTrigger,
  FloatingPanelContent,
  FloatingPanelBody,
  FloatingPanelButton,
} from './ui/floating-panel';
import { TextAnimate } from './ui/text-animate';


const appCards = [
  {
    id: 'instagram',
    app: 'Instagram',
    handle: '@akireshopcr',
    href: 'https://instagram.com/akireshopcr',
    cta: 'Ver perfil',
    iconBg: 'bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    app: 'WhatsApp',
    handle: '+506 1234 5678',
    href: 'https://wa.me/50612345678',
    cta: 'Enviar mensaje',
    iconBg: 'bg-[#25D366]',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    id: 'email',
    app: 'Mail',
    handle: 'hola@akire.cr',
    href: 'mailto:hola@akire.cr',
    cta: 'Enviar correo',
    iconBg: 'bg-gradient-to-b from-[#5AC8FA] to-[#007AFF]',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

function ContactForm() {
  const [step, setStep] = useState(1);
  const [openCard, setOpenCard] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', comoNosEncontraste: '',
    newsletter: false, consultaSobre: '', provincia: '', mensaje: '',
  });
  const prevStep = useRef(1);

  const set = field => e => setFormData(p => ({ ...p, [field]: e.target.value }));
  const toggleNewsletter = () => setFormData(p => ({ ...p, newsletter: !p.newsletter }));

  const goToStep = next => { prevStep.current = step; setStep(next); };

  const handleStep1Continue = () => {
    if (!formData.nombre.trim()) return toast.error('Por favor ingresa tu nombre');
    if (!formData.email.includes('@')) return toast.error('Por favor ingresa un correo válido');
    goToStep(2);
  };

  const handleStep2Submit = () => {
    if (!formData.mensaje.trim()) return toast.error('Por favor escribe tu mensaje');
    toast.success('¡Mensaje enviado! Te contactaremos pronto.');
    goToStep(3);
  };

  const resetForm = () => {
    prevStep.current = 1;
    setStep(1);
    setFormData({ nombre:'', apellido:'', email:'', comoNosEncontraste:'',
      newsletter:false, consultaSobre:'', provincia:'', mensaje:'' });
  };

  const inputCls = 'bg-gray-100 border border-transparent rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-gray-300 transition-all w-full';
  const labelCls = 'text-sm font-medium text-gray-900 mb-1.5 flex items-center gap-1.5';
  const infoBadge = <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0 cursor-default">i</span>;

  const primaryBtn = (label, onClick) => (
    <button type="button" onClick={onClick}
      className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white rounded-xl py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all">
      {label}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
      </svg>
    </button>
  );

  const SelectWrapper = ({ children }) => (
    <div className="relative">
      {children}
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );

  const direction = step > prevStep.current ? 1 : -1;

  return (
    <div className="relative z-10 flex flex-col h-full w-full max-w-2xl mx-auto p-6 sm:p-8 lg:p-12">
      <div className="w-full">

        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((n, i) => {
            const isDone = step > n;
            const isActive = step === n;
            return (
              <React.Fragment key={n}>
                <div className={
                  isDone || isActive
                    ? 'w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0'
                    : 'w-7 h-7 rounded-full border-2 border-gray-200 text-gray-400 text-xs flex items-center justify-center flex-shrink-0'
                }>
                  {isDone
                    ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    : n}
                </div>
                {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-1.5" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step content with slide animation */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ x: direction * 20 }}
            animate={{ x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* ── PASO 1 ── */}
            {step === 1 && (
              <div>
                {/* Título con acento decorativo */}
                <div className="mb-8">
                  <div className="w-7 h-0.5 bg-gray-900 mb-4" />
                  <TextAnimate
                    text="Un momento antes de continuar"
                    type="whipIn"
                    className="font-serif text-3xl font-medium text-gray-900 tracking-tight leading-tight mb-2"
                  />
                  <p className="text-sm text-gray-400">Tarda menos de un minuto.</p>
                </div>

                {/* Campos con stagger de entrada */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0, ease: [0.23, 1, 0.32, 1] }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div>
                      <label className={labelCls}>Tu nombre</label>
                      <input type="text" placeholder="Ana" value={formData.nombre} onChange={set('nombre')} className={inputCls} autoFocus />
                    </div>
                    <div>
                      <label className={labelCls}>Tu apellido</label>
                      <input type="text" placeholder="García" value={formData.apellido} onChange={set('apellido')} className={inputCls} />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0.10, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <label className={labelCls}>Correo electrónico</label>
                    <input type="email" placeholder="tu@email.com" value={formData.email} onChange={set('email')} className={inputCls} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0.20, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <label className={labelCls}>¿Cómo nos encontraste? {infoBadge}</label>
                    <FloatingPanelRoot>
                      <FloatingPanelTrigger title="¿Cómo nos encontraste?">
                        <span className={formData.comoNosEncontraste ? 'text-gray-900' : 'text-gray-400'}>
                          {formData.comoNosEncontraste || 'Seleccionar...'}
                        </span>
                      </FloatingPanelTrigger>
                      <FloatingPanelContent>
                        <FloatingPanelBody>
                          {['Redes sociales', 'Recomendación', 'Google', 'Otro'].map(op => (
                            <FloatingPanelButton
                              key={op}
                              active={formData.comoNosEncontraste === op}
                              onClick={() => setFormData(p => ({ ...p, comoNosEncontraste: op }))}
                            >
                              {op}
                            </FloatingPanelButton>
                          ))}
                        </FloatingPanelBody>
                      </FloatingPanelContent>
                    </FloatingPanelRoot>
                  </motion.div>

                  <motion.label
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0.30, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-start gap-3 cursor-pointer group mt-1"
                  >
                    <div
                      onClick={toggleNewsletter}
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${formData.newsletter ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500'}`}
                    >
                      {formData.newsletter && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input type="checkbox" className="sr-only" checked={formData.newsletter} onChange={toggleNewsletter} />
                    <span className="text-sm text-gray-500 flex items-center gap-1.5">
                      Quiero recibir novedades y drops exclusivos {infoBadge}
                    </span>
                  </motion.label>
                </div>

                {/* Botón con pop */}
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.42, delay: 0.38, ease: [0.23, 1, 0.32, 1] }}
                  className="mt-6"
                >
                  {primaryBtn('Continuar', handleStep1Continue)}
                  <button type="button" onClick={() => goToStep(2)} className="text-xs text-center text-gray-400 hover:text-gray-600 transition-colors mt-3 w-full block">
                    Solo quiero enviar un mensaje
                  </button>
                </motion.div>
              </div>
            )}

            {/* ── PASO 2 ── */}
            {step === 2 && (
              <div>
                <div className="mb-8">
                  <div className="w-7 h-0.5 bg-gray-900 mb-4" />
                  <h2 className="font-serif text-3xl font-medium text-gray-900 tracking-tight leading-tight mb-2">
                    Tu consulta
                  </h2>
                  <p className="text-sm text-gray-400">Cuéntanos en qué podemos ayudarte.</p>
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <label className={labelCls}>¿Sobre qué consultas? {infoBadge}</label>
                    <FloatingPanelRoot>
                      <FloatingPanelTrigger title="¿Sobre qué consultas?">
                        <span className={formData.consultaSobre ? 'text-gray-900' : 'text-gray-400'}>
                          {formData.consultaSobre || 'Seleccionar...'}
                        </span>
                      </FloatingPanelTrigger>
                      <FloatingPanelContent>
                        <FloatingPanelBody>
                          {['Pedido', 'Talla', 'Producto', 'Devolución', 'Otro'].map(op => (
                            <FloatingPanelButton
                              key={op}
                              active={formData.consultaSobre === op}
                              onClick={() => setFormData(p => ({ ...p, consultaSobre: op }))}
                            >
                              {op}
                            </FloatingPanelButton>
                          ))}
                        </FloatingPanelBody>
                      </FloatingPanelContent>
                    </FloatingPanelRoot>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0.10, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <label className={labelCls}>Provincia</label>
                    <FloatingPanelRoot>
                      <FloatingPanelTrigger title="Provincia">
                        <span className={formData.provincia ? 'text-gray-900' : 'text-gray-400'}>
                          {formData.provincia || 'Seleccionar...'}
                        </span>
                      </FloatingPanelTrigger>
                      <FloatingPanelContent>
                        <FloatingPanelBody>
                          {['San José','Alajuela','Cartago','Heredia','Guanacaste','Puntarenas','Limón'].map(p => (
                            <FloatingPanelButton
                              key={p}
                              active={formData.provincia === p}
                              onClick={() => setFormData(prev => ({ ...prev, provincia: p }))}
                            >
                              {p}
                            </FloatingPanelButton>
                          ))}
                        </FloatingPanelBody>
                      </FloatingPanelContent>
                    </FloatingPanelRoot>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0.20, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <label className={labelCls}>Mensaje *</label>
                    <textarea
                      rows={3}
                      placeholder="Cuéntanos más..."
                      value={formData.mensaje}
                      onChange={set('mensaje')}
                      className={`${inputCls} resize-none`}
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.42, delay: 0.28, ease: [0.23, 1, 0.32, 1] }}
                  className="mt-6"
                >
                  {primaryBtn('Enviar mensaje', handleStep2Submit)}
                  <button type="button" onClick={() => goToStep(1)} className="text-xs text-center text-gray-400 hover:text-gray-600 transition-colors mt-3 w-full block">
                    ← Volver
                  </button>
                </motion.div>
              </div>
            )}

            {/* ── PASO 3: SUCCESS ── */}
            {step === 3 && (
              <div className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-900 font-semibold text-xl mb-1">¡Listo! Tu mensaje fue enviado</p>
                <p className="text-gray-400 text-sm mb-8">Te respondemos en menos de 24h</p>
                <button type="button" onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors">
                  Enviar otro mensaje
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Social cards — siempre visibles */}
        <div className="mt-6 border-t border-gray-100 pt-4 space-y-px">
          {appCards.map(card => {
            const isOpen = openCard === card.id;
            return (
              <Expandable key={card.id} expanded={isOpen}
                onToggle={() => setOpenCard(isOpen ? null : card.id)}
                transitionDuration={0.22} easeType="easeOut"
              >
                <ExpandableTrigger className="w-full">
                  <div className="flex items-center gap-3 py-2.5 group">
                    <div className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors">
                      {card.icon}
                    </div>
                    <span className="flex-1 text-xs text-gray-500 group-hover:text-gray-600 transition-colors font-medium">
                      {card.app}
                    </span>
                    <motion.svg
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </motion.svg>
                  </div>
                </ExpandableTrigger>
                <ExpandableContent preset="slide-up">
                  <div className="pb-3 pl-10 flex items-center gap-3">
                    <span className="text-[11px] text-gray-500 font-mono">{card.handle}</span>
                    <a href={card.href}
                      target={card.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-[10px] text-gray-500 hover:text-gray-900 border-b border-gray-200 hover:border-gray-400 transition-colors pb-px"
                    >
                      {card.cta} ↗
                    </a>
                  </div>
                </ExpandableContent>
              </Expandable>
            );
          })}
        </div>

      </div>
    </div>
  );
}

/* Floating trigger button positioned via a portal so it's outside
   the fixed navbar stacking context — ExpandableScreen layoutId works correctly */
function ContactTriggerPortal({ btnRef }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    function update() {
      if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    }
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [btnRef]);

  if (!rect) return null;

  return createPortal(
    <ExpandableScreen layoutId="contact-screen" triggerRadius="100px" contentRadius="20px">
      <div
        className="contact-trigger"
        style={{
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          zIndex: 41,
          pointerEvents: 'auto',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ExpandableScreenTrigger>
          <div
            className="w-full h-full text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center justify-center transition-colors"
            style={{ width: rect.width, height: rect.height }}
          >
            Contacto
          </div>
        </ExpandableScreenTrigger>
      </div>

      <ExpandableScreenContent className="bg-white" closeButtonClassName="bg-gray-100 hover:bg-gray-200 text-gray-700">
        <ContactForm />
      </ExpandableScreenContent>
    </ExpandableScreen>,
    document.body
  );
}

const mobileNavLinks = [
  { to: '/collection?tag=new-arrival', label: 'New Drop' },
  { to: '/collection', label: 'Shop', end: true },
  { to: '/collection?tag=trending', label: 'Best Sellers' },
  { to: '/about', label: 'Información' },
  { to: '/contact', label: 'Contacto' },
  { to: '/wishlist', label: 'Wishlist' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, setOpen } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const contactBtnRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Floating pill navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none px-4 pt-4">
        <div className="pointer-events-auto w-full max-w-5xl bg-white/80 backdrop-blur-md border border-gray-200/70 rounded-full shadow-sm shadow-black/5 px-4 sm:px-5 flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="font-serif text-xl font-bold tracking-tight text-gray-900">
            akire
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <NavLink to="/collection?tag=new-arrival" className={({ isActive }) => `nav-link transition-colors ${isActive ? 'text-gray-900 font-semibold active' : 'hover:text-gray-900'}`}>
              New Drop
            </NavLink>
            <NavLink to="/collection" end className={({ isActive }) => `nav-link transition-colors ${isActive ? 'text-gray-900 font-semibold active' : 'hover:text-gray-900'}`}>
              Shop
            </NavLink>
            <NavLink to="/collection?tag=trending" className={({ isActive }) => `nav-link transition-colors ${isActive ? 'text-gray-900 font-semibold active' : 'hover:text-gray-900'}`}>
              Best Sellers
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link transition-colors ${isActive ? 'text-gray-900 font-semibold active' : 'hover:text-gray-900'}`}>
              Información
            </NavLink>

            {/* Placeholder invisible — solo para medir posición del portal */}
            <div
              ref={contactBtnRef}
              className="text-sm font-medium text-transparent pointer-events-none select-none"
              aria-hidden="true"
            >
              Contacto
            </div>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <Link to="/collection" className="p-2 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100" aria-label="Buscar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </Link>

            <Link to="/wishlist" className="p-2 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100" aria-label="Wishlist">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1 p-2 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              {totalItems > 0 && (
                <span className="text-xs font-semibold text-gray-900">({totalItems})</span>
              )}
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-2 text-sm ml-1">
                <Link to="/profile" className="hover:text-gray-600 transition-colors px-2 py-1 rounded-full hover:bg-gray-100">{user.name.split(' ')[0]}</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="font-medium text-gray-900 px-2 py-1 rounded-full hover:bg-gray-100">Admin</Link>
                )}
                <button onClick={handleLogout} className="hover:text-gray-600 transition-colors text-xs px-2 py-1 rounded-full hover:bg-gray-100">Salir</button>
              </div>
            )}

            {/* Hamburger morph */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors ml-1"
              aria-label="Menú"
            >
              <div className="relative w-5 h-[14px] flex flex-col justify-between">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  className="block h-[1.5px] w-full bg-gray-900 origin-center"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  className="block h-[1.5px] w-full bg-gray-900"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  className="block h-[1.5px] w-full bg-gray-900 origin-center"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Contact trigger portaled to body so layoutId animation works correctly */}
      <ContactTriggerPortal btnRef={contactBtnRef} />

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-30 md:hidden"
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-[4.5rem] left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xl shadow-black/10 overflow-hidden"
            >
              <nav className="px-5 py-5 flex flex-col gap-1">
                {mobileNavLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.end}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}

                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: mobileNavLinks.length * 0.04, ease: [0.23, 1, 0.32, 1] }}
                      className="mt-2 pt-2 border-t border-gray-100"
                    >
                      <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Mi cuenta</NavLink>
                    </motion.div>
                    {user.role === 'admin' && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: (mobileNavLinks.length + 1) * 0.04, ease: [0.23, 1, 0.32, 1] }}>
                        <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Admin</NavLink>
                      </motion.div>
                    )}
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: (mobileNavLinks.length + 2) * 0.04, ease: [0.23, 1, 0.32, 1] }}>
                      <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">Salir</button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: mobileNavLinks.length * 0.04, ease: [0.23, 1, 0.32, 1] }} className="mt-2 pt-2 border-t border-gray-100">
                      <NavLink to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Entrar</NavLink>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: (mobileNavLinks.length + 1) * 0.04, ease: [0.23, 1, 0.32, 1] }}>
                      <NavLink to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">Registrarse</NavLink>
                    </motion.div>
                  </>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
