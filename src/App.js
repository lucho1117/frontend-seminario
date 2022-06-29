import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppConfig } from './AppConfig';

import Dashboard from './components/Dashboard';


import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/demo/flags/flags.css';
import './assets/demo/Demos.scss';
import './assets/layout/layout.scss';
import './App.scss';

import Categoria from './ventas/categoria/Categoria';
import Producto from './ventas/producto/Producto';
import Cliente from './user/clientes/Cliente';
import TipoAlquiler from './ventas/tipoAlquiler/TipoAlquiler';
import PrincipalVentas from './ventas/PrincipalVentas';


import TipoVehiculo from './transportes/tipoVehiculo/TipoVehiculo';
import Vehiculo from './transportes/vehiculo/Vehiculo';
import Viaje from './transportes/viaje/Viaje';
import ClienteTransporte from './transportes/clientes/Cliente'; 
import Asignacion from './transportes/asignacion/Asignacion';

import TipoObra from './construccion/tipoObra/TipoObra';
import TipoMaterial from './construccion/tipoMaterial/TipoMaterial';
import Material from './construccion/material/Material';
import Obra from './construccion/obra/Obra';

import TipoMateriaPrima from './plantas/tipoMateriaPrima/TipoMateriaPrima';
import TipoMaquinaria from './plantas/tipoMaquinaria/TipoMaquinaria';
import MateriaPrima from './plantas/materiaPrima/MateriaPrima';
import Maquinaria from './plantas/maquinaria/Maquinaria';
import Proceso from './plantas/proceso/Proceso';

import Empleado from './user/empleado/Empleado';

const App = (props) => {
    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('light')
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;


    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    }

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        {
            label: 'Inicio',
            items: [{
                label: 'Principal', icon: 'pi pi-fw pi-home', to: '/', },
                {label: 'Empleados', icon: 'pi pi-fw pi-users', to: '/empleado'},
            ]
        },
        {
            label: 'MODULOS', icon: 'pi pi-fw pi-search',
            items: [
                {
                    label: 'VENTAS', icon: 'pi pi-fw pi-shopping-cart',
                    items: [
                        {label: 'Principal', icon: 'pi pi-fw pi-tags', to: '/principalVenta'},
                        {label: 'Categorias', icon: 'pi pi-fw pi-sitemap' , to: '/categoria' },
                        {label: 'Productos', icon: 'pi pi-fw pi-table', to: '/producto'},
                        {label: 'Tipo Alquiler', icon: 'pi pi-fw pi-th-large', to: '/tipoAlquiler'},
                        {label: 'Clientes', icon: 'pi pi-fw pi-users', to: '/cliente/ventas'},
                    ]
                },
                {
                    label: 'TRASNPORTE', icon: 'pi pi-fw pi-car',
                    items: [
                        {label: 'Asignaciones', icon: 'pi pi-fw pi-tag', to: '/asignacion'},
                        {label: 'Viajes', icon: 'pi pi-fw pi-send', to: '/viaje'},
                        {label: 'Vehiculo', icon: 'pi pi-fw pi-car', to: '/vehiculo'},
                        {label: 'Tipo Vehiculo', icon: 'pi pi-fw pi-clone', to: '/tipoVehiculo'},
                        {label: 'Clientes', icon: 'pi pi-fw pi-users', to: '/clienteTransporte'}
                    ]
                },
                {
                    label: 'CONSTRUCCION', icon: 'pi pi-fw pi-building',
                    items: [
                        {label: 'Clientes', icon: 'pi pi-fw pi-users', to: '/cliente/construccion'},
                        {label: 'Obras', icon: 'pi pi-fw pi-building', to: '/obra'},
                        {label: 'Materiales', icon: 'pi pi-fw pi-briefcase', to: '/material'},
                        {label: 'Tipo Obras', icon: 'pi pi-fw pi-box', to: '/tipoObra'},
                        {label: 'Tipo Materiales', icon: 'pi pi-fw pi-sitemap', to: '/tipoMaterial'},
                    ]
                },
                
                {
                    label: 'PLANTAS', icon: 'pi pi-fw pi-th-large',
                    items: [
                        {label: 'Procesos', icon: 'pi pi-fw pi-box', to: '/proceso'},
                        {label: 'Materias Primas', icon: 'pi pi-fw pi-building', to: '/materiaPrima'},
                        {label: 'Tipo Materia Prima', icon: 'pi pi-fw pi-bookmark', to: '/tipoMateriaPrima'},
                        {label: 'Maquinaria', icon: 'pi pi-fw pi-car', to: '/maquinaria'},
                        {label: 'Tipo Maquinaria', icon: 'pi pi-fw pi-car', to: '/tipoMaquinaria'},
                    ]
                },
            ]
        },
    ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false,
        'layout-theme-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode}
                mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} setAutenticado={props.setAutenticado}  />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/"  exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} />



                    <Route path="/cliente/ventas"  render={() => <Cliente idNegocio={3} />}/>
                    <Route path="/cliente/construccion"  render={() => <Cliente idNegocio={6} />}/>
                    <Route path="/categoria" component={Categoria} />
                    <Route path="/producto" component={Producto} />
                    <Route path="/tipoAlquiler" component={TipoAlquiler} />
                    <Route path="/principalVenta" component={PrincipalVentas} />

                    <Route path="/tipoVehiculo" component={TipoVehiculo}/>
                    <Route path="/vehiculo" component={Vehiculo}/>
                    <Route path="/viaje" component={Viaje}/>
                    <Route path="/clienteTransporte" component={ClienteTransporte}/>
                    <Route path="/asignacion" component={Asignacion}/>

                    <Route path="/tipoObra" component={TipoObra}/>
                    <Route path="/tipoMaterial" component={TipoMaterial}/>
                    <Route path="/material" component={Material}/>
                    <Route path="/obra" component={Obra}/>


                    <Route path="/tipoMaquinaria" component={TipoMaquinaria}/>
                    <Route path="/tipoMateriaPrima" component={TipoMateriaPrima}/>
                    <Route path="/materiaPrima" component={MateriaPrima}/>
                    <Route path="/maquinaria" component={Maquinaria}/>
                    <Route path="/proceso" component={Proceso}/>


                    <Route path="/empleado" component={Empleado}/>

                </div>

                <AppFooter layoutColorMode={layoutColorMode} />
            </div>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange}  />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>
    );

}

export default App;
