/// <reference types="../../../node_modules/electron/electron" />
/// <reference types="../../core/build/fudgecore" />
/// <reference types="../../../userinterface/build/fudgeuserinterface" />
/// <reference types="../../GoldenLayout/golden-layout" />
declare namespace Fudge {
    export type ContextMenuCallback = (menuItem: Electron.MenuItem, browserWindow: Electron.BrowserWindow, event: Electron.KeyboardEvent) => void;
    type Subclass<T> = {
        subclasses: T[];
        name: string;
    };
    export class ContextMenu {
        static appendCopyPaste(_menu: Electron.Menu): void;
        static getSubclassMenu<T extends Subclass<T>>(_id: CONTEXTMENU, _class: T, _callback: ContextMenuCallback): Electron.Menu;
    }
    export {};
}
declare namespace Fudge {
    enum CONTEXTMENU {
        ADD_NODE = 0,
        ACTIVATE_NODE = 1,
        DELETE_NODE = 2,
        ADD_COMPONENT = 3,
        DELETE_COMPONENT = 4,
        ADD_COMPONENT_SCRIPT = 5,
        EDIT = 6,
        CREATE_MESH = 7,
        CREATE_MATERIAL = 8,
        CREATE_GRAPH = 9,
        CREATE_ANIMATION = 10,
        CREATE_PARTICLE_EFFECT = 11,
        SYNC_INSTANCES = 12,
        REMOVE_COMPONENT = 13,
        ADD_JOINT = 14,
        DELETE_RESOURCE = 15,
        ORTHGRAPHIC_CAMERA = 16,
        RENDER_CONTINUOUSLY = 17,
        ADD_PROPERTY = 18,
        DELETE_PROPERTY = 19,
        ADD_PARTICLE_PROPERTY = 20,
        ADD_PARTICLE_FUNCTION = 21,
        ADD_PARTICLE_FUNCTION_NAMED = 22,
        ADD_PARTICLE_CONSTANT = 23,
        ADD_PARTICLE_CONSTANT_NAMED = 24,
        ADD_PARTICLE_TRANSFORMATION = 25,
        DELETE_PARTICLE_DATA = 26
    }
    enum MENU {
        QUIT = "quit",
        PROJECT_NEW = "projectNew",
        PROJECT_SAVE = "projectSave",
        PROJECT_LOAD = "projectLoad",
        DEVTOOLS_OPEN = "devtoolsOpen",
        PANEL_GRAPH_OPEN = "panelGraphOpen",
        PANEL_ANIMATION_OPEN = "panelAnimationOpen",
        PANEL_PROJECT_OPEN = "panelProjectOpen",
        PANEL_HELP_OPEN = "panelHelpOpen",
        PANEL_PARTICLE_SYSTEM_OPEN = "panelParticleSystemOpen",
        FULLSCREEN = "fullscreen"
    }
    enum PANEL {
        GRAPH = "PanelGraph",
        PROJECT = "PanelProject",
        HELP = "PanelHelp",
        ANIMATION = "PanelAnimation",
        PARTICLE_SYSTEM = "PanelParticleSystem"
    }
    enum VIEW {
        HIERARCHY = "ViewHierarchy",
        ANIMATION = "ViewAnimation",
        ANIMATION_SHEET = "ViewAnimationSheet",
        RENDER = "ViewRender",
        COMPONENTS = "ViewComponents",
        CAMERA = "ViewCamera",
        INTERNAL = "ViewInternal",
        EXTERNAL = "ViewExternal",
        PROPERTIES = "ViewProperties",
        PREVIEW = "ViewPreview",
        SCRIPT = "ViewScript",
        PARTICLE_SYSTEM = "ViewParticleSystem"
    }
    enum TRANSFORM {
        TRANSLATE = "translate",
        ROTATE = "rotate",
        SCALE = "scale"
    }
}
declare namespace Fudge {
    export enum MIME {
        TEXT = "text",
        AUDIO = "audio",
        IMAGE = "image",
        MESH = "mesh",
        UNKNOWN = "unknown"
    }
    const fs: ??.General;
    export class DirectoryEntry {
        path: typeof fs.PathLike;
        pathRelative: typeof fs.PathLike;
        dirent: typeof fs.Dirent;
        stats: Object;
        constructor(_path: typeof fs.PathLike, _pathRelative: typeof fs.PathLike, _dirent: typeof fs.Dirent, _stats: Object);
        static createRoot(_path: typeof fs.PathLike): DirectoryEntry;
        get name(): string;
        set name(_name: string);
        get isDirectory(): boolean;
        get type(): string;
        delete(): void;
        getDirectoryContent(): DirectoryEntry[];
        getFileContent(): string;
        addEntry(_entry: DirectoryEntry): void;
        getMimeType(): MIME;
    }
    export {};
}
declare namespace Fudge {
    enum EVENT_EDITOR {
        CREATE = "EDITOR_CREATE",
        SELECT = "EDITOR_SELECT",
        MODIFY = "EDITOR_MODIFY",
        DELETE = "EDITOR_DELETE",
        CLOSE = "EDITOR_CLOSE",
        TRANSFORM = "EDITOR_TRANSFORM",
        FOCUS = "EDITOR_FOCUS"
    }
    interface EventDetail {
        node?: ??.Node;
        graph?: ??.Graph;
        resource?: ??.SerializableResource;
        mutable?: ??.Mutable;
        transform?: Object;
        view?: View;
        data?: ??.General;
    }
    /**
     * Extension of CustomEvent that supports a detail field with the type EventDetail
     */
    class EditorEvent extends CustomEvent<EventDetail> {
    }
}
declare namespace Fudge {
    let watcher: ??.General;
    function newProject(): Promise<void>;
    function saveProject(_new?: boolean): Promise<boolean>;
    function promptLoadProject(): Promise<URL>;
    function loadProject(_url: URL): Promise<void>;
}
declare namespace Fudge {
    import ?? = FudgeCore;
    class Project extends ??.Mutable {
        #private;
        base: URL;
        name: string;
        fileIndex: string;
        fileInternal: string;
        fileScript: string;
        fileStyles: string;
        private graphAutoView;
        constructor(_base: URL);
        openDialog(): Promise<boolean>;
        hndChange: (_event: Event) => void;
        load(htmlContent: string): Promise<void>;
        getProjectJSON(): string;
        getProjectCSS(): string;
        getProjectHTML(_title: string): string;
        getMutatorAttributeTypes(_mutator: ??.Mutator): ??.MutatorAttributeTypes;
        protected reduceMutator(_mutator: ??.Mutator): void;
        private getGraphs;
        private createProjectHTML;
        private settingsStringify;
        private panelsStringify;
        private stringifyHTML;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    const ipcRenderer: Electron.IpcRenderer;
    const remote: Electron.Remote;
    let project: Project;
    interface PanelInfo {
        type: string;
        state: PanelState;
    }
    /**
     * The uppermost container for all panels controlling data flow between.
     * @authors Monika Galkewitsch, HFU, 2019 | Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class Page {
        static goldenLayoutModule: ??.General;
        static modeTransform: TRANSFORM;
        private static idCounter;
        private static goldenLayout;
        private static panels;
        private static physics;
        static setDefaultProject(): void;
        static getPanelInfo(): string;
        static setPanelInfo(_panelInfos: string): void;
        static setTransform(_mode: TRANSFORM): void;
        static getPhysics(_graph: ??.Graph): ??.Physics;
        private static start;
        private static setupGoldenLayout;
        private static add;
        private static find;
        private static generateID;
        private static loadLayout;
        private static setupPageListeners;
        /** Send custom copies of the given event to the views */
        private static broadcastEvent;
        private static hndKey;
        private static hndEvent;
        private static hndPanelCreated;
        private static loadProject;
        private static setupMainListeners;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    import ??ui = FudgeUserInterface;
    class ControllerAnimation {
        private static readonly PROPERTY_COLORS;
        private animation;
        private propertyList;
        private view;
        private sequences;
        constructor(_animation: ??.Animation, _propertyList: HTMLElement, _view: ViewAnimation);
        updatePropertyList(_mutator: ??.Mutator): void;
        updateSequence(_time: number, _element: ??ui.CustomElement): void;
        nextKey(_time: number, _direction: "forward" | "backward"): number;
        addProperty(_path: string[]): void;
        deleteProperty(_element: HTMLElement): void;
        private getSelectedSequences;
        private deletePath;
        private hndEvent;
    }
}
declare namespace Fudge {
    /**
     * Base class for all [[View]]s to support generic functionality
     * @authors Monika Galkewitsch, HFU, 2019 | Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    abstract class View {
        private static views;
        private static idCount;
        dom: HTMLElement;
        protected contextMenu: Electron.Menu;
        private container;
        private id;
        constructor(_container: ComponentContainer, _state: JsonValue);
        static getViewSource(_event: DragEvent): View;
        private static registerViewForDragDrop;
        setTitle(_title: string): void;
        getDragDropSources(): Object[];
        dispatch(_type: EVENT_EDITOR, _init: CustomEventInit<EventDetail>): void;
        protected openContextMenu: (_event: Event) => void;
        protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu;
        protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void;
        protected hndDrop(_event: DragEvent, _source: View): void;
        protected hndDragOver(_event: DragEvent, _source: View): void;
        private hndEventCommon;
    }
}
declare namespace Fudge {
    /**
     * List the external resources
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewExternal extends View {
        private tree;
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        setProject(): void;
        getSelection(): DirectoryEntry[];
        getDragDropSources(): DirectoryEntry[];
        private hndEvent;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    let typesOfResources: ??.General[];
    /**
     * List the internal resources
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewInternal extends View {
        private table;
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        listResources(): void;
        getSelection(): ??.SerializableResource[];
        getDragDropSources(): ??.SerializableResource[];
        protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu;
        protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): Promise<void>;
        protected hndDragOver(_event: DragEvent, _viewSource: View): void;
        protected hndDrop(_event: DragEvent, _viewSource: View): Promise<void>;
        private hndEvent;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    import ??Ui = FudgeUserInterface;
    class ControllerComponent extends ??Ui.Controller {
        constructor(_mutable: ??.Mutable, _domElement: HTMLElement);
        protected mutateOnInput: (_event: Event) => Promise<void>;
        private hndKey;
        private hndDragOver;
        private hndDrop;
        private filterDragDrop;
        private getAncestorWithType;
    }
}
declare namespace Fudge {
    import ??ui = FudgeUserInterface;
    class ControllerTableResource extends ??ui.TableController<??.SerializableResource> {
        private static head;
        private static getHead;
        getHead(): ??ui.TABLE[];
        getLabel(_object: ??.SerializableResource): string;
        rename(_object: ??.SerializableResource, _new: string): boolean;
        copy(_originals: ??.SerializableResource[]): Promise<??.SerializableResource[]>;
        delete(_focussed: ??.SerializableResource[]): Promise<??.SerializableResource[]>;
        sort(_data: ??.SerializableResource[], _key: string, _direction: number): void;
    }
}
declare namespace Fudge {
    import ??ui = FudgeUserInterface;
    class ScriptInfo {
        name: string;
        namespace: string;
        superClass: string;
        script: Function;
        isComponent: boolean;
        isComponentScript: boolean;
        constructor(_script: Function, _namespace: string);
    }
    class ControllerTableScript extends ??ui.TableController<ScriptInfo> {
        private static head;
        private static getHead;
        getHead(): ??ui.TABLE[];
        getLabel(_object: ScriptInfo): string;
        rename(_object: ScriptInfo, _new: string): boolean;
        delete(_focussed: ScriptInfo[]): Promise<ScriptInfo[]>;
        copy(_originals: ScriptInfo[]): Promise<ScriptInfo[]>;
        sort(_data: ScriptInfo[], _key: string, _direction: number): void;
    }
}
declare namespace Fudge {
    import ??Ui = FudgeUserInterface;
    class ControllerTreeDirectory extends ??Ui.TreeController<DirectoryEntry> {
        getLabel(_entry: DirectoryEntry): string;
        getAttributes(_object: DirectoryEntry): string;
        rename(_entry: DirectoryEntry, _new: string): boolean;
        hasChildren(_entry: DirectoryEntry): boolean;
        getChildren(_entry: DirectoryEntry): DirectoryEntry[];
        delete(_focussed: DirectoryEntry[]): DirectoryEntry[];
        addChildren(_entries: DirectoryEntry[], _target: DirectoryEntry): DirectoryEntry[];
        copy(_originals: DirectoryEntry[]): Promise<DirectoryEntry[]>;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    import ??Ui = FudgeUserInterface;
    class ControllerTreeHierarchy extends ??Ui.TreeController<??.Node> {
        getLabel(_node: ??.Node): string;
        getAttributes(_node: ??.Node): string;
        rename(_node: ??.Node, _new: string): boolean;
        hasChildren(_node: ??.Node): boolean;
        getChildren(_node: ??.Node): ??.Node[];
        delete(_focussed: ??.Node[]): ??.Node[];
        addChildren(_children: ??.Node[], _target: ??.Node): ??.Node[];
        copy(_originals: ??.Node[]): Promise<??.Node[]>;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    import ??ui = FudgeUserInterface;
    class ControllerTreeParticleSystem extends ??ui.CustomTreeController<??.ParticleData.Recursive> {
        childToParent: Map<??.ParticleData.Recursive, ??.ParticleData.Recursive>;
        private data;
        constructor(_data: ??.ParticleData.System);
        createContent(_data: ??.ParticleData.Recursive): HTMLFormElement;
        getAttributes(_data: ??.ParticleData.Recursive): string;
        rename(_data: ??.ParticleData.Recursive, _id: string, _new: string): void;
        hasChildren(_data: ??.ParticleData.Recursive): boolean;
        getChildren(_data: ??.ParticleData.Recursive): ??.ParticleData.Recursive[];
        delete(_focused: (??.ParticleData.Recursive)[]): (??.ParticleData.Recursive)[];
        addChildren(_children: ??.ParticleData.Recursive[], _target: ??.ParticleData.Recursive, _at?: number): ??.ParticleData.Recursive[];
        copy(_originals: ??.ParticleData.Recursive[]): Promise<??.ParticleData.Recursive[]>;
        draggable(_target: ??.ParticleData.Recursive): boolean;
        private getKey;
        private deleteData;
        private isReferenced;
    }
}
declare namespace Fudge {
    interface PanelState {
        [key: string]: string;
    }
    /**
     * Base class for all [[Panel]]s aggregating [[View]]s
     * Subclasses are presets for common panels. A user might add or delete [[View]]s at runtime
     * @authors Monika Galkewitsch, HFU, 2019 | Lukas Scheuerle, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
     */
    abstract class Panel extends View {
        protected goldenLayout: GoldenLayout;
        protected views: View[];
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        /** Send custom copies of the given event to the views */
        broadcastEvent: (_event: EditorEvent) => void;
        abstract getState(): PanelState;
        private addViewComponent;
    }
}
declare namespace Fudge {
    /**
     * TODO: add
     * @authors Jonas Plotzky, HFU, 2022
     */
    class PanelAnimation extends Panel {
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        getState(): {
            [key: string]: string;
        };
        private hndEvent;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    /**
    * Shows a graph and offers means for manipulation
    * @authors Monika Galkewitsch, HFU, 2019 | Jirka Dell'Oro-Friedl, HFU, 2020
    */
    class PanelGraph extends Panel {
        private graph;
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        setGraph(_graph: ??.Graph): void;
        getState(): {
            [key: string]: string;
        };
        private hndEvent;
    }
}
declare namespace Fudge {
    /**
    * Shows a help and documentation
    * @authors Jirka Dell'Oro-Friedl, HFU, 2021
    */
    class PanelHelp extends Panel {
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        getState(): {
            [key: string]: string;
        };
    }
}
declare namespace Fudge {
    /**
     * TODO: add
     * @authors Jonas Plotzky, HFU, 2022
     */
    class PanelParticleSystem extends Panel {
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        getState(): {
            [key: string]: string;
        };
        private hndEvent;
    }
}
declare namespace Fudge {
    /**
     * Display the project structure and offer functions for creation, deletion and adjustment of resources
     * @authors Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class PanelProject extends Panel {
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        getState(): {
            [key: string]: string;
        };
        private hndEvent;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    /**
     * View and edit a particle system attached to a node.
     * @authors Jonas Plotzky, HFU, 2022
     */
    class ViewParticleSystem extends View {
        static readonly PROPERTY_KEYS: (keyof ??.ParticleData.System)[];
        static readonly TRANSFORMATION_KEYS: (keyof ??.ParticleData.Transformation)[];
        static readonly COLOR_KEYS: (keyof ??.ParticleData.Color)[];
        private particleSystem;
        private data;
        private tree;
        private controller;
        private errors;
        private variables;
        constructor(_container: ComponentContainer, _state: Object);
        protected openContextMenu: (_event: Event) => void;
        protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu;
        protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void;
        protected hndDragOver(_event: DragEvent, _viewSource: View): void;
        protected hndDrop(_event: DragEvent, _viewSource: View): void;
        private hndEvent;
        private setParticleSystem;
        private validateData;
        private enableSave;
        private refreshVariables;
    }
}
declare namespace Fudge {
    /**
     * View and edit the animatable properties of a node with an attached component animation.
     * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2022
     */
    class ViewAnimation extends View {
        private node;
        private cmpAnimator;
        private animation;
        private playbackTime;
        private propertyList;
        private controller;
        private toolbar;
        private frameInput;
        private time;
        private idInterval;
        constructor(_container: ComponentContainer, _state: Object);
        protected hndDragOver(_event: DragEvent, _viewSource: View): void;
        protected hndDrop(_event: DragEvent, _viewSource: View): void;
        protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu;
        protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void;
        private getNodeSubmenu;
        private getMutatorSubmenu;
        private createToolbar;
        private hndEvent;
        private setAnimation;
        private createPropertyList;
        private animate;
        private hndToolbarClick;
        private pause;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    interface ViewAnimationSequence {
        data: ??.AnimationSequence;
        color: string;
    }
    /**
     * View and edit animation sequences, animation keys and curves connecting them.
     * @authors Lukas Scheuerle, HFU, 2019 | Jonas Plotzky, HFU, 2022
     */
    class ViewAnimationSheet extends View {
        #private;
        private static readonly KEY_SIZE;
        private static readonly TIMELINE_HEIGHT;
        private static readonly EVENTS_HEIGHT;
        private static readonly SCALE_WIDTH;
        private static readonly PIXEL_PER_MILLISECOND;
        private static readonly PIXEL_PER_VALUE;
        private static readonly MINIMUM_PIXEL_PER_STEP;
        private static readonly STANDARD_ANIMATION_LENGTH;
        private animation;
        private playbackTime;
        private canvas;
        private crc2;
        private eventInput;
        private scrollContainer;
        private scrollBody;
        private mtxWorldToScreen;
        private selectedKey;
        private selectedEvent;
        private keys;
        private sequences;
        private events;
        private slopeHooks;
        private documentStyle;
        private posPanStart;
        private posRightClick;
        constructor(_container: ComponentContainer, _state: Object);
        private get mode();
        private set mode(value);
        protected openContextMenuSheet: (_event: Event) => void;
        protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu;
        protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void;
        private draw;
        private generateKeys;
        private generateKey;
        private drawTimeline;
        private drawEvents;
        private drawScale;
        private drawCurves;
        private drawKeys;
        private drawCursor;
        private drawHighlight;
        private hndEvent;
        private hndPointerDown;
        private hndPointerMoveTimeline;
        private hndPointerMoveSlope;
        private hndPointerMovePan;
        private hndPointerMoveDragKey;
        private hndPointerMoveDragEvent;
        private hndPointerUp;
        private hndWheel;
        private hndScroll;
        private animate;
        private resetView;
        private screenToWorldPoint;
        private worldToScreenPoint;
        private screenToTime;
        private timeToScreen;
        private round;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    /**
     * View all components attached to a node
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewComponents extends View {
        private node;
        private expanded;
        private selected;
        private drag;
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        getDragDropSources(): ??.ComponentCamera[];
        protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu;
        protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void;
        protected hndDragOver(_event: DragEvent, _viewSource: View): void;
        protected hndDrop(_event: DragEvent, _viewSource: View): void;
        private fillContent;
        private hndEvent;
        private hndTransform;
        private transform3;
        private transform2;
        private select;
        private getSelected;
        private createComponent;
        private findComponentType;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    /**
     * View the hierarchy of a graph as tree-control
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewHierarchy extends View {
        #private;
        private graph;
        private tree;
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        setGraph(_graph: ??.Graph): void;
        getSelection(): ??.Node[];
        getDragDropSources(): ??.Node[];
        showNode(_node: ??.Node): void;
        protected hndDragOver(_event: DragEvent, _viewSource: View): void;
        protected hndDrop(_event: DragEvent, _viewSource: View): Promise<void>;
        protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu;
        protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void;
        private hndEvent;
        private checkGraphDrop;
    }
}
declare namespace Fudge {
    import ?? = FudgeCore;
    /**
     * View the rendering of a graph in a viewport with an independent camera
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewRender extends View {
        #private;
        private cmrOrbit;
        private viewport;
        private canvas;
        private graph;
        private nodeLight;
        constructor(_container: ComponentContainer, _state: JsonValue);
        createUserInterface(): void;
        setGraph(_node: ??.Graph): void;
        protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu;
        protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void;
        protected openContextMenu: (_event: Event) => void;
        protected hndDragOver(_event: DragEvent, _viewSource: View): void;
        protected hndDrop(_event: DragEvent, _viewSource: View): void;
        private setCameraOrthographic;
        private hndPrepare;
        private hndEvent;
        private hndPick;
        private hndPointer;
        private activeViewport;
        private redraw;
    }
}
declare namespace Fudge {
    /**
     * Preview a resource
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewPreview extends View {
        private static mtrStandard;
        private static meshStandard;
        private resource;
        private viewport;
        private cmrOrbit;
        private previewNode;
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        private static createStandardMaterial;
        private static createStandardMesh;
        protected getContextMenu(_callback: ContextMenuCallback): Electron.Menu;
        protected contextMenuCallback(_item: Electron.MenuItem, _window: Electron.BrowserWindow, _event: Electron.Event): void;
        private fillContent;
        private createStandardGraph;
        private setViewObject;
        private illuminate;
        private createFilePreview;
        private createTextPreview;
        private createImagePreview;
        private createAudioPreview;
        private createScriptPreview;
        private hndEvent;
        private resetCamera;
        private redraw;
    }
}
declare namespace Fudge {
    /**
     * View the properties of a resource
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewProperties extends View {
        private resource;
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        protected hndDragOver(_event: DragEvent, _viewSource: View): void;
        private fillContent;
        private hndEvent;
    }
}
declare namespace Fudge {
    /**
     * List the scripts loaded
     * @author Jirka Dell'Oro-Friedl, HFU, 2020
     */
    class ViewScript extends View {
        private table;
        constructor(_container: ComponentContainer, _state: JsonValue | undefined);
        listScripts(): void;
        getSelection(): ScriptInfo[];
        getDragDropSources(): ScriptInfo[];
        private hndEvent;
    }
}
