<template>
    <div>
        <div style="height: 500px;">
            <div style="width: 20%;height: 100%;float: left;">
                <el-steps direction="vertical" :active="active" finish-status="wait" align-center>
                    <el-step title="Create Task" @click.native="()=>active = 0"></el-step>
                    <el-step title="3dSkullStrip" @click.native="()=>active = 1"></el-step>
                    <el-step title="Anatomical Registration" @click.native="()=>active = 2"></el-step>
                    <el-step title="Tissue Segmentation" @click.native="()=>active = 3"></el-step>
                    <el-step title="Slice Time Correction" @click.native="()=>active = 4"></el-step>
                    <el-step title="Functional to Anatomical Registration" @click.native="()=>active = 5"></el-step>
                    <el-step title="Functional to MNI Registration" @click.native="()=>active = 6"></el-step>
                    <el-step title="Nuisance Regression" @click.native="()=>active = 7"></el-step>
                    <!--<el-step title="Median Angle Correction" @click.native="()=>active = 7"></el-step>-->
                    <el-step title="Temporal Filtering" @click.native="()=>active = 8"></el-step>
                    <el-step title="Region-of-interest TSE" @click.native="()=>active = 9"></el-step>
                    <el-step title="Functional Connectivity" @click.native="()=>active = 10"></el-step>
                </el-steps>
            </div>
            <el-scrollbar style="width: 80%;height: 100%;float: right;">

                <div :hidden="active !== 0">
                    <el-form label-position="left" v-model="temporalFilteringOptions" label-width="280px">
                        <h1>Create Task</h1>
                        <el-form-item label="Task Name">
                            <el-autocomplete :fetch-suggestions="querySearch" v-model="taskname" style="width: 300px"></el-autocomplete>
                        </el-form-item>
                        <el-form-item label="Drag and Drop File Uploading Zone">
                            <div
                                    v-loading="showuploading"
                                    :element-loading-text="uploadmsg"
                                    element-loading-spinner="el-icon-loading"
                                    element-loading-background="rgba(0, 0, 0, 0.8)"
                                    class="myCenter myupload"
                                    style="float: left;"
                                    @click="()=>showuploading = uploading"
                                    :ref="'select_frame'">
                                <i class="el-icon-plus" style="font-size: 50px;color: #8cc5ff"></i>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 1">
                    <el-form label-position="left" :model="thirdDimensionSkullStrip" label-width="200px">
                        <h1>3dSkullStrip Options</h1>
                        <el-form-item label="Shrink factor" prop="shrinkFactor">
                            <el-input v-model="thirdDimensionSkullStrip.shrinkFactor" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Vary Shrink Factor" prop="varyShrinkFactor">
                            <el-select v-model="thirdDimensionSkullStrip.varyShrinkFactor">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Shrink Factor Bottom Limit" prop="shrinkFactorBottomLimit">
                            <el-input v-model="thirdDimensionSkullStrip.shrinkFactorBottomLimit" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Avoid Ventricles" prop="avoidVentricles">
                            <el-select v-model="thirdDimensionSkullStrip.avoidVentricles">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Number of iterations" prop="numberOfIterations">
                            <el-input v-model="thirdDimensionSkullStrip.numberOfIterations" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Pushout" prop="pushout">
                            <el-select v-model="thirdDimensionSkullStrip.pushout">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Touchup" prop="touchup">
                            <el-select v-model="thirdDimensionSkullStrip.touchup">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Number of iterations" prop="numberOfIterations">
                            <el-input v-model="thirdDimensionSkullStrip.fillHoleOption" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="NN Smooth" prop="nnSmooth">
                            <el-input v-model="thirdDimensionSkullStrip.nnSmooth" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Smooth final" prop="smoothFinal">
                            <el-input v-model="thirdDimensionSkullStrip.smoothFinal" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Avoid eyes" prop="avoideyes">
                            <el-select v-model="thirdDimensionSkullStrip.avoideyes">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Use edge" prop="useEdge">
                            <el-select v-model="thirdDimensionSkullStrip.useEdge">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Fractional expantion" prop="fractionalExpantion">
                            <el-input v-model="thirdDimensionSkullStrip.fractionalExpantion" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Push to edge" prop="pushToEdge">
                            <el-select v-model="thirdDimensionSkullStrip.pushToEdge">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Use skull" prop="useSkull">
                            <el-select v-model="thirdDimensionSkullStrip.useSkull">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="perc_int" prop="percInt">
                            <el-input v-model="thirdDimensionSkullStrip.percInt" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Max_inter_iter" prop="maxInterIter">
                            <el-input v-model="thirdDimensionSkullStrip.maxInterIter" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Fac" prop="fac">
                            <el-input v-model="thirdDimensionSkullStrip.fac" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="blur fwhm" prop="blurFwhm">
                            <el-input v-model="thirdDimensionSkullStrip.blurFwhm" style="width: 100px"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 2">
                    <el-form label-position="left" :model="anatomicalRegistration" label-width="370px">
                        <h1>Anatomical Registration</h1>
                        <!--<el-form-item label="Anatomical Template Resolution" prop="resoution">-->
                        <!--<el-select v-model="anatomicalRegistration.resoution">-->
                        <!--<el-option label="1mm" value="1mm"></el-option>-->
                        <!--<el-option label="2mm" value="2mm"></el-option>-->
                        <!--<el-option label="3mm" value="3mm"></el-option>-->
                        <!--</el-select>-->
                        <!--</el-form-item>-->
                        <el-form-item label="Anatomical Template（Brain Only）" prop="brain">
                            <el-input v-model="anatomicalRegistration.brain" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['anatomicalRegistration','brain'], 'fslstandard')"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="Anatomical Template（With Skull）" prop="skull">
                            <el-input v-model="anatomicalRegistration.skull" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['anatomicalRegistration','skull'], 'fslstandard')"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="Anatomical Template Registration Method" prop="registrationMethod">
                            <el-select v-model="anatomicalRegistration.registrationMethod" disabled>
                                <el-option label="ANTS" value="ANTS"></el-option>
                                <el-option label="FSL" value="FSL"></el-option>
                                <el-option label="ANTS & FSL" value="ANTS & FSL"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Use shull-on image to calculate transform?(ANTS only)" prop="registrationMethod">
                            <el-select v-model="anatomicalRegistration.regWithSkull">
                                <el-option label="off" value="off"></el-option>
                                <el-option label="on" value="on"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 3">
                    <el-form label-position="left" :model="tissueSegmentation" label-width="300px">
                        <h1>Tissue Segmentation</h1>
                        <el-form-item label="Run Tissue Segmentation" prop="runTissueSegmentation">
                            <el-select v-model="tissueSegmentation.runTissueSegmentation" disabled>
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="White Matter Prior Probability Map" prop="runTissueSegmentation">
                            <el-input v-model="tissueSegmentation.whiteMatter" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['tissueSegmentation','whiteMatter'], 'fslstandard_tissuepriors')"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="Gray Matter Prior Probability Map" prop="runTissueSegmentation">
                            <el-input v-model="tissueSegmentation.grayMatter" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['tissueSegmentation','grayMatter'], 'fslstandard_tissuepriors')"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="CSF Prior Probability Map" prop="runTissueSegmentation">
                            <el-input v-model="tissueSegmentation.csf" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['tissueSegmentation','csf'], 'fslstandard_tissuepriors')"></i>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 4">
                    <el-form label-position="left" label-width="200px" :model="timeSeries">
                        <h1>Slice Time Correction</h1>
                        <el-form-item label="Perform Slice Time Correction" prop="performSliceTimeCorrection">
                            <el-select v-model="timeSeries.performSliceTimeCorrection" disabled>
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="TR(in seconds)" prop="TR">
                            <el-input v-model="timeSeries.TR" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Slice Acquisition Pattern" prop="sliceAcquisitionPattern">
                            <el-select v-model="timeSeries.sliceAcquisitionPattern">
                                <el-option label="Use NIFTI Header" value="Use NIFTI Header"></el-option>
                                <el-option label="alt+z" value="alt+z"></el-option>
                                <el-option label="alt+z2" value="alt+z2"></el-option>
                                <el-option label="alt-z" value="alt-z"></el-option>
                                <el-option label="alt-z2" value="alt-z2"></el-option>
                                <el-option label="seq+z" value="seq+z"></el-option>
                                <el-option label="seq-z" value="seq-z"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="first Timepoint" prop="firstTimePoint">
                            <el-input v-model="timeSeries.firstTimePoint" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="last Timepoint" prop="lastTimePoint">
                            <el-input v-model="timeSeries.lastTimePoint" style="width: 100px"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 5">
                    <el-form label-position="left" label-width="350px" :model="functionalToAnatomicalRegistration">
                        <h1>Functional to Anatomical Registration</h1>
                        <el-form-item label="Run Functional to Anatomical Registration" prop="runFunctionalToAnatomicalRegistration">
                            <el-select v-model="functionalToAnatomicalRegistration.runFunctionalToAnatomicalRegistration" disabled>
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Using BB Register" prop="usingBBRegister">
                            <el-select v-model="functionalToAnatomicalRegistration.usingBBRegister" disabled>
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Boundary Based Registration Scheduler" prop="boundaryBasedRegistrationScheduler">
                            <el-input v-model="functionalToAnatomicalRegistration.boundaryBasedRegistrationScheduler" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['functionalToAnatomicalRegistration','boundaryBasedRegistrationScheduler'], 'fsletc_flirtsch')"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="Use as Functional-to-Anatomical Registration input" prop="useAsFunctionalToAnatomicalRegistrationInput">
                            <el-select v-model="functionalToAnatomicalRegistration.useAsFunctionalToAnatomicalRegistrationInput" disabled>
                                <el-option label="Mean Functional" value="Mean Functional"></el-option>
                                <el-option label="Selected Functional Volume" value="Selected Functional Volume"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Functional Masking" prop="functionalMasking">
                            <el-select v-model="functionalToAnatomicalRegistration.functionalMasking" disabled>
                                <el-option label="3dAutoMask" value="3dAutoMask"></el-option>
                                <el-option label="BET" value="BET"></el-option>
                                <el-option label="3dAutoMask & BET" value="3dAutoMask & BET"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 6">
                    <el-form label-position="left" label-width="350px" :model="functionalToMNIRegistration">
                        <h1>Functional to MNI Registration</h1>
                        <el-form-item label="Run Functional to MNI Registration" prop="runFunctionalToMNIRegistration">
                            <el-select v-model="functionalToMNIRegistration.runFunctionalToMNIRegistration" disabled>
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <!--<el-form-item label="Functional-totTemplate Resolution" prop="functionalToTemplateResolution">-->
                        <!--<el-select v-model="functionalToMNIRegistration.functionalToTemplateResolution">-->
                        <!--<el-option label="4mm" value="4mm"></el-option>-->
                        <!--<el-option label="3mm" value="3mm"></el-option>-->
                        <!--<el-option label="2mm" value="2mm"></el-option>-->
                        <!--<el-option label="1mm" value="1mm"></el-option>-->
                        <!--</el-select>-->
                        <!--</el-form-item>-->
                        <el-form-item label="Standard Brain Only Template(functional resolution)" prop="standardBrainOnly">
                            <el-input v-model="functionalToMNIRegistration.standardBrainOnly" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['functionalToMNIRegistration','standardBrainOnly'], 'fslstandard')"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="Standard Template with Skull(functional resolution)" prop="standardWithSkull">
                            <el-input v-model="functionalToMNIRegistration.standardWithSkull" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['functionalToMNIRegistration','standardWithSkull'], 'fslstandard')"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="Standard Identity Matrix" prop="standardIdentityMatrix">
                            <el-input v-model="functionalToMNIRegistration.standardIdentityMatrix" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['functionalToMNIRegistration','standardIdentityMatrix'], 'fsletc_flirtsch')"></i>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 7">
                    <el-form label-position="left" v-model="nuisanceRegression" label-width="300px">
                        <h1>Nuisance Regression</h1>
                        <el-form-item label="Run Nuisance Single Regression">
                            <el-select v-model="nuisanceRegression.runNuisanceSingleRegression">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Lateral Ventricles Mask(Standard Space)">
                            <el-input v-model="nuisanceRegression.laterVentriclesMash" readonly>
                                <i class="iconfont icon-dir" slot="append" @click="setFileList(['nuisanceRegression','laterVentriclesMash'], 'fsldata_atlases')"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="Select Regressors">
                            <el-row type="flex">
                                <div style="min-width: 160px;min-height:180px;border: 2px solid #99D3F5;">
                                    <el-checkbox-group v-model="nuisanceRegression.selectRegressors" style="margin-right: 20px">
                                        <div v-for="item in selectRegressorsOptions" :key="item">
                                            <el-checkbox :label="item" checked></el-checkbox>
                                            <br/>
                                        </div>
                                    </el-checkbox-group>
                                </div>
                                <el-popover
                                        placement="right"
                                        title="Select Regressors"
                                        width="200"
                                        trigger="click">
                                    <el-checkbox-group v-model="selectRegressors" style="margin-right: 20px">
                                        <el-checkbox label="compcor"></el-checkbox>
                                        <br/>
                                        <el-checkbox label="wm"></el-checkbox>
                                        <br/>
                                        <el-checkbox label="csf"></el-checkbox>
                                        <br/>
                                        <el-checkbox label="global"></el-checkbox>
                                        <br/>
                                        <el-checkbox label="pcl"></el-checkbox>
                                        <br/>
                                        <el-checkbox label="motion"></el-checkbox>
                                        <br/>
                                        <el-checkbox label="linear"></el-checkbox>
                                        <br/>
                                        <el-checkbox label="quadratic"></el-checkbox>
                                        <br/>
                                        <el-checkbox label="gm"></el-checkbox>
                                    </el-checkbox-group>
                                    <el-button type="primary" style="float: right;" @click="()=>{
                                    let temp = selectRegressors.toString().replace(/,/g,'.');
                                    selectRegressors=[];
                                    if(selectRegressorsOptions.indexOf(temp) > -1)return;
                                    selectRegressorsOptions.push(temp);
                                    }">OK</el-button>
                                    <el-button slot="reference" round>十</el-button>
                                </el-popover>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="CompCor Components" prop="compCorComponents">
                            <el-input v-model="nuisanceRegression.compCorComponents" style="width: 100px"></el-input>
                        </el-form-item>
                        <el-form-item label="Use Friston's 24(Motion Regression)" prop="useFriston24">
                            <el-select v-model="nuisanceRegression.useFriston24">
                                <el-option label="on" value="on"></el-option>
                                <el-option label="off" value="off"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 8">
                    <el-form label-position="left" v-model="temporalFilteringOptions" label-width="180px">
                        <h1>Temporal Filtering Options</h1>
                        <el-form-item label="Run Temporal Filtering">
                            <el-select v-model="temporalFilteringOptions.runTemporalFiltering">
                                <el-option label="off" value="off"></el-option>
                                <el-option label="on" value="on"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Band-Pass Filters">
                            <el-row type="flex">
                                <div style="min-width: 160px;min-height:100px;border: 2px solid #99D3F5;">
                                    <el-checkbox-group v-model="temporalFilteringOptions.bandPassFilters" style="margin-right: 20px">
                                        <div v-for="item in bandPassFiltersOptions" :key="item">
                                            <el-checkbox :label="item" checked></el-checkbox>
                                            <br/>
                                        </div>
                                    </el-checkbox-group>
                                </div>
                                <el-popover
                                        placement="right"
                                        title="Enter frequency Cutoffs(in Hz)"
                                        width="300"
                                        trigger="click">
                                    <el-input v-model="lfc" @blur="()=>lfc = parseFloat(lfc).toFixed(4)"><span slot="prepend">Low-frequency Cutoffs</span></el-input>
                                    <el-input v-model="hfc" @blur="()=>hfc = parseFloat(hfc).toFixed(4)"><span slot="prepend">High-frequency Cutoffs</span></el-input>
                                    <el-button type="primary" style="float: right;" @click="()=> {
                                    if(bandPassFiltersOptions.indexOf('['+lfc+','+hfc+']') < 0)bandPassFiltersOptions.push('['+lfc+','+hfc+']')
                                    }">OK</el-button>
                                    <el-button slot="reference" round>十</el-button>
                                </el-popover>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 9">
                    <el-form label-position="left" v-model="temporalFilteringOptions" label-width="180px">
                        <h1>Region-of-interest TSE</h1>
                        <el-form-item label="Extract ROI Time Series">
                            <el-select v-model="timeSeriesExtraction.extractROITimeSeries" disabled>
                                <el-option label="off" value="off"></el-option>
                                <el-option label="on" value="on"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="TSE ROI Paths(Avg)">
                            <el-row type="flex">
                                <div style="min-width: 160px;min-height:100px;border: 2px solid #99D3F5;">
                                    <el-checkbox-group v-model="timeSeriesExtraction.tseROIpaths" style="margin-right: 20px">
                                        <div v-for="item in filePathOptions" :key="item">
                                            <el-checkbox :label="item" checked></el-checkbox>
                                            <br/>
                                        </div>
                                    </el-checkbox-group>
                                </div>
                                <el-popover
                                        placement="top"
                                        title="Enter File Paths"
                                        width="600"
                                        trigger="click">
                                    <el-input v-model="filePath" readonly>
                                        <i class="iconfont icon-dir" slot="append" @click="setFileList(['filePath'], 'fmri_templates')"></i>
                                    </el-input>
                                    <div style="text-align: center">
                                        <el-button type="primary" style="margin: 10px auto 0 auto;" @click="()=>{
                                        if(filePathOptions.indexOf(filePath)<0)filePathOptions.push(filePath)
                                        }">OK</el-button>
                                    </div>
                                    <el-button slot="reference" round>十</el-button>
                                </el-popover>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </div>
                <div :hidden="active !== 10">
                    <el-form label-position="left" v-model="functionalConnectivity" label-width="240px">
                        <h1>Functional Connectivity</h1>
                        <el-form-item label="Functional Connectivity Computation">
                            <el-select v-model="functionalConnectivity.correlation">
                                <el-option label="off" value="off"></el-option>
                                <el-option label="pearsonr" value="pearsonr"></el-option>
                                <el-option label="partial" value="partial"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
        </div>
        <el-dialog :title=" dialogTitle " :visible.sync="dialogTableVisible" :modal-append-to-body="false">
            <el-tree
                    :data="dialogData"
                    node-key="id"
                    :expand-on-click-node="true"
                    :modal-append-to-body='false'>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span v-if="data.children === undefined" @click="() => setFile(node)"><img src="@/assets/img/wendang.png" height="16" width="16"/>{{ node.label }}</span>
                    <span v-else><img src="@/assets/img/wenjianjia.png" height="16" width="16"/>{{ node.label }}</span>
                </span>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <!--<el-button>从本地导入</el-button>-->
                <el-button @click="dialogTableVisible = false">取 消</el-button>
            </span>
        </el-dialog >
        <el-dialog title="fMRI REPORT" :visible.sync="runDialogTableVisible">
            <div style="white-space: pre-wrap;">
                <p v-html="fmriTextarea"></p>
            </div>
        </el-dialog>
        <div style="text-align: center">
            <el-button type="primary" style="margin: 10px auto 0 auto;font-size: 1.5rem" @click="onSubmit">run</el-button>
        </div>
        <!--<el-button type="primary" style="float: right" @click="downloadResult">download</el-button>-->
    </div>
</template>

<script>
    /* eslint-disable */
    import cache from "@/utils/cache"
    import { fslstandard, fslstandard_tissuepriors, fsletc_flirtsch, fsldata_atlases, fmri_templates } from '../data-index'
    export default {
        name: "fmri",
        data() {
            return {
                active: 0,
                uploading: false,
                showuploading: false,
                uploadmsg: '',
                taskList: [],
                thirdDimensionSkullStrip: {
                    shrinkFactor: 0.6,
                    varyShrinkFactor: 'on',
                    shrinkFactorBottomLimit: 0.4,
                    avoidVentricles: 'on',
                    numberOfIterations: 250,
                    pushout: 'on',
                    touchup: 'on',
                    fillHoleOption: 10,
                    nnSmooth: 72,
                    smoothFinal: 20,
                    avoideyes: 'on',
                    useEdge: 'on',
                    fractionalExpantion: 0.1,
                    pushToEdge: 'on',
                    useSkull: 'off',
                    percInt: 0,
                    maxInterIter: 4,
                    fac: 1,
                    blurFwhm: 0
                },
                tissueSegmentation: {
                    runTissueSegmentation: 'on',
                    whiteMatter: '/public/fmri/fsl/data/standard/tissuepriors/2mm/avg152T1_white_bin.nii.gz',
                    grayMatter: '/public/fmri/fsl/data/standard/tissuepriors/2mm/avg152T1_gray_bin.nii.gz',
                    csf: '/public/fmri/fsl/data/standard/tissuepriors/2mm/avg152T1_csf_bin.nii.gz'
                },
                anatomicalRegistration: {
                    resoution: '2mm',
                    brain: '/public/fmri/fsl/data/standard/MNI152_T1_2mm_brain.nii.gz',
                    skull: '/public/fmri/fsl/data/standard/MNI152_T1_2mm.nii.gz',
                    registrationMethod: 'ANTS',
                    regWithSkull: 'off'
                },
                timeSeries: {
                    performSliceTimeCorrection: 'on',
                    TR: 'None',
                    sliceAcquisitionPattern: 'Use NIFTI Header',
                    firstTimePoint: 4,
                    lastTimePoint: 'None'
                },
                functionalToAnatomicalRegistration:{
                    runFunctionalToAnatomicalRegistration: 'on',
                    usingBBRegister: 'on',
                    boundaryBasedRegistrationScheduler: '/public/fmri/fsl/etc/flirtsch/bbr.sch',
                    useAsFunctionalToAnatomicalRegistrationInput: 'Mean Functional',
                    functionalMasking: '3dAutoMask'
                },
                functionalToMNIRegistration:{
                    runFunctionalToMNIRegistration: 'on',
                    functionalToTemplateResolution: '3mm',
                    standardBrainOnly: '/public/fmri/fsl/data/standard/MNI152_T1_3mm_brain.nii.gz',
                    standardWithSkull: '/public/fmri/fsl/data/standard/MNI152_T1_3mm.nii.gz',
                    standardIdentityMatrix: '/public/fmri/fsl/etc/flirtsch/ident.mat'
                },
                nuisanceRegression: {
                    runNuisanceSingleRegression: 'on',
                    laterVentriclesMash: '/public/fmri/fsl/data/atlases/HarvardOxford/HarvardOxford-lateral-ventricles-thr25-2mm.nii.gz',
                    selectRegressors: [],
                    compCorComponents: 5,
                    useFriston24: 'on'
                },
                temporalFilteringOptions: {
                    runTemporalFiltering: 'off',
                    bandPassFilters: []
                },
                timeSeriesExtraction: {
                    extractROITimeSeries: 'on',
                    tseROIpaths: []
                },
                functionalConnectivity: {
                    correlation: 'off',
                },
                selectRegressors: [],
                selectRegressorsOptions: [],
                bandPassFiltersOptions: [],
                filePathOptions: [],
                lfc: parseFloat(0.01).toFixed(4),
                hfc: parseFloat(1.0).toFixed(4),
                filePath: '',
                dialogTitle: '',
                fileListType: '',
                dialogTableVisible: false,
                dialogData: fslstandard,
                setPathEle: [],
                taskname: '',
                fmriTextarea: '',
                runDialogTableVisible: false
            }
        },
        mounted() {
            this.initUploadField();
            this.$axios.get('/getdirlist/fmri').then(res => {
                let taskList = []
                res.data.data.forEach(v=>taskList.push({value:v.name}))
                this.taskList = taskList
                this.taskname = taskList.length === 0? 'task':taskList[0].value
            })
        },
        watch: {
            // 'taskname': function () {
            //     this.$axios.get('/getdirlist/fmri/'+this.taskname+'/data').then(res => {
            //         this.taskList = res.data.data
            //     })
            // },
            // 'showuploading': function () {
            //     if (this.showuploading) return;
            //     this.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-loading')
            //     this.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-loading')
            // },
            // 'lfc': function() {
            //     this.lfc = parseFloat(this.lfc).toFixed(4)
            // },
            // 'hfc': function() {
            //     this.hfc = parseFloat(this.hfc).toFixed(4)
            // },
            '$store.state.fmri.fmriState': function () {
                // console.log(this.$store.state.fmri.fmriState)
                if (this.$store.state.fmri.fmriState !== 'finish') return;
                this.$confirm('fMRI脚本运行结束，是否下载结果？', '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '下载',
                    cancelButtonText: '否'
                }).then(()=>this.downloadResult())
                    .catch(()=>this.$message.info('运行结果可在home查看'))
            },
            '$store.state.fmri.outputText': function () {
                this.runDialogTableVisible = true
                let line = this.$store.state.fmri.outputText
                this.fmriTextarea += '\n' + line
            }
        },
        methods: {
            onSubmit: function () {
                this.$axios.post('/find',['/fmri/'+this.taskname+'/data'])
                    .then(res=>{
                        if(res.data.data[0].match(/-find\s(.+)/)[1] === 'success') return Promise.resolve();
                        else return Promise.reject()
                    }).then(() => {
                        let parameterList = {}
                        parameterList['skullstrip_shrink_factor'] = this.thirdDimensionSkullStrip.shrinkFactor
                        parameterList['skullstrip_var_shrink_fac'] = this.thirdDimensionSkullStrip.varyShrinkFactor === 'on'
                        parameterList['skullstrip_shrink_factor_bot_lim'] = this.thirdDimensionSkullStrip.shrinkFactorBottomLimit
                        parameterList['skullstrip_avoid_vent'] = this.thirdDimensionSkullStrip.avoidVentricles === 'on'
                        parameterList['skullstrip_n_iterations'] = this.thirdDimensionSkullStrip.numberOfIterations
                        parameterList['skullstrip_pushout'] = this.thirdDimensionSkullStrip.pushout === 'on'
                        parameterList['skullstrip_touchup'] = this.thirdDimensionSkullStrip.touchup === 'on'
                        parameterList['skullstrip_fill_hole'] = this.thirdDimensionSkullStrip.fillHoleOption
                        parameterList['skullstrip_NN_smooth'] = this.thirdDimensionSkullStrip.nnSmooth
                        parameterList['skullstrip_smooth_final'] = this.thirdDimensionSkullStrip.smoothFinal
                        parameterList['skullstrip_avoid_eyes'] = this.thirdDimensionSkullStrip.avoideyes === 'on'
                        parameterList['skullstrip_use_edge'] = this.thirdDimensionSkullStrip.useEdge === 'on'
                        parameterList['skullstrip_exp_frac'] = this.thirdDimensionSkullStrip.fractionalExpantion
                        parameterList['skullstrip_push_to_edge'] = this.thirdDimensionSkullStrip.pushToEdge === 'on'
                        parameterList['skullstrip_use_skull'] = this.thirdDimensionSkullStrip.useSkull === 'on'
                        parameterList['skullstrip_perc_int'] = this.thirdDimensionSkullStrip.percInt
                        parameterList['skullstrip_max_inter_iter'] = this.thirdDimensionSkullStrip.maxInterIter
                        parameterList['skullstrip_fac'] = this.thirdDimensionSkullStrip.fac
                        parameterList['skullstrip_blur_fwhm'] = this.thirdDimensionSkullStrip.blurFwhm
                        parameterList['template_brain_only_for_anat'] = this.anatomicalRegistration.brain
                        parameterList['template_skull_for_anat'] = this.anatomicalRegistration.skull
                        parameterList['regWithSkull'] = this.anatomicalRegistration.regWithSkull === 'on'
                        parameterList['PRIORS_WHITE'] = this.tissueSegmentation.whiteMatter
                        parameterList['PRIORS_GRAY'] = this.tissueSegmentation.grayMatter
                        parameterList['PRIORS_CSF'] = this.tissueSegmentation.csf
                        parameterList['TR'] = this.timeSeries.TR
                        parameterList['slice_timing_pattern'] = this.timeSeries.sliceAcquisitionPattern
                        parameterList['startIdx'] = parseInt(this.timeSeries.firstTimePoint)
                        parameterList['stopIdx'] = this.timeSeries.lastTimePoint
                        parameterList['boundaryBasedRegistrationSchedule'] = this.functionalToAnatomicalRegistration.boundaryBasedRegistrationScheduler
                        parameterList['template_brain_only_for_func'] = this.functionalToMNIRegistration.standardBrainOnly
                        parameterList['template_skull_for_func'] = this.functionalToMNIRegistration.standardWithSkull
                        parameterList['identityMatrix'] = this.functionalToMNIRegistration.standardIdentityMatrix
                        parameterList['runNuisance'] = this.nuisanceRegression.runNuisanceSingleRegression === 'on'
                        parameterList['lateral_ventricles_mask'] = this.nuisanceRegression.laterVentriclesMash
                        // parameterList['Regressors'] = this.nuisanceRegression.selectRegressors
                        let regressors = {'compcor':false,'wm':false,'csf':false,'global':false,'pc1':false,'motion':false,'linear':false,'quadratic':false,'gm':false}
                        let arr = this.nuisanceRegression.selectRegressors.toString().replace(/,/g,'.').split('.')
                        if (arr[0] !== '') for (let i = 0;i < arr.length;i++) regressors[arr[i]] = true
                        parameterList['Regressors'] = regressors
                        parameterList['nComponents'] = this.nuisanceRegression.compCorComponents
                        parameterList['runFristonModel'] = this.nuisanceRegression.useFriston24 === 'on'
                        parameterList['runFrequencyFiltering'] = this.temporalFilteringOptions.runTemporalFiltering === 'on'
                        parameterList['nuisanceBandpassFreq'] = this.temporalFilteringOptions.bandPassFilters
                        parameterList['tsa_roi_paths'] = this.timeSeriesExtraction.tseROIpaths
                        parameterList['correlation'] = this.functionalConnectivity.correlation === 'off' ? false : this.functionalConnectivity.correlation
                        // console.log(parameterList)
                        this.$axios.post('/fmri/'+this.taskname+'/'+cache.getToken(), {jsonstr:JSON.stringify(parameterList)})
                            .then(res => this.$message({message: res.data.message, type: 'info'}))
                    }).catch(()=>this.$message({message: 'you have no upload data yet', type: 'info'}))
            },
            downloadResult(){
                let url = '/MyFile/fmri/'+this.taskname+'/working.zip'
                let link = document.createElement('a')
                link.download = this.taskname+'_working.zip'// 跨域状态（非同源）下无法用download属性设置下载文件名
                link.href = 'http:' + window.g.API_URL + url
                link.click()
            },
            setFileList: function (ele, fileList) {
                this.setPathEle = ele
                this.fileListType = fileList
                if (fileList === 'fslstandard')  this.dialogData = fslstandard
                else if (fileList === 'fslstandard_tissuepriors')  this.dialogData = fslstandard_tissuepriors
                else if (fileList === 'fsletc_flirtsch')  this.dialogData = fsletc_flirtsch
                else if (fileList === 'fsldata_atlases')  this.dialogData = fsldata_atlases
                else if (fileList === 'fmri_templates')  this.dialogData = fmri_templates
                this.dialogTableVisible = true
            },
            setFile: function (node) {
                let url;
                if (this.fileListType === 'fslstandard')  url = '/public/fmri/fsl/data/standard/'+node.data.label;
                else if (this.fileListType === 'fslstandard_tissuepriors')  url = '/public/fmri/fsl/data/standard/tissuepriors/'+node.parent.data.label+'/'+node.data.label;
                else if (this.fileListType === 'fsletc_flirtsch')  url = '/public/fmri/fsl/etc/flirtsch/'+node.data.label;
                else if (this.fileListType === 'fsldata_atlases')  url = '/public/fmri/fsl/data/atlases/HarvardOxford/'+node.data.label;
                else if (this.fileListType === 'fmri_templates')  url = '/public/fmri/fmri_templates/'+node.data.label;
                let p = this
                for (let i = 0; i < this.setPathEle.length - 1; i++) p = p[this.setPathEle[i]]
                p[this.setPathEle[this.setPathEle.length - 1]] = url
                this.dialogTableVisible = false
            },
            querySearch(queryString, cb) {
                let restaurants = this.taskList;
                let results = queryString ? restaurants.filter(data => !queryString || data.value.toLowerCase().includes(queryString.toLowerCase())) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            initUploadField: function (item) {

                this.$refs.select_frame.ondragleave = (e) => {
                    e.preventDefault();  //阻止离开时的浏览器默认行为
                };
                this.$refs.select_frame.ondrop = (e) => {
                    e.preventDefault();    //阻止拖放后的浏览器默认行为
                    const self = this
                    if (self.uploading === true)return;
                    const list = []
                    let totalcount = 0
                    let uploadcount = 0
                    self.uploading=true
                    self.showuploading=true
                    // const uploadlog = this.$message({
                    //     message: '文件上传(0/0)',
                    //     type: 'info',
                    //     duration: 0
                    // })
                    function uploadFile() {
                        if (list.length === 0) {
                            // self.$message.success('upload success')
                            // uploadlog.close()
                            self.$axios.get('/getdirlist/fmri').then(res => {
                                let taskList = []
                                res.data.data.forEach(v=>taskList.push({value:v.name}))
                                self.taskList = taskList
                            })
                            self.uploading=false
                            self.uploadmsg='文件上传成功，一共'+totalcount+'个文件'
                            self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-success')
                            self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-success')
                            // self.$refs['select_frame'].innerHTML = self.$refs['select_frame'].innerHTML.replace(/el-icon-loading/g, 'el-icon-success')
                            return;
                        }
                        let file = list.pop()
                        const formData = new FormData();
                        let name = file.fullPath === undefined ? file.name : file.fullPath;
                        name = self.taskname+'/data/'+name
                        formData.append('uploadfile', file, encodeURIComponent(name))
                        self.$axios.post('/uploadfiles/fmri', formData, {
                            onUploadProgress (p){
                                // uploadlog.message='文件上传('+uploadcount+'/'+totalcount+')  '+Math.ceil(100 * ( p.loaded / p.total ))+'%'
                                self.uploadmsg='文件上传('+uploadcount+'/'+totalcount+')  '+Math.ceil(100 * ( p.loaded / p.total ))+'%'
                            }
                        }).then(res=>{uploadcount++;self.uploadmsg='文件上传('+uploadcount+'/'+totalcount+')';uploadFile()})
                            .catch(err=>{
                                self.$message.warning(err);
                                // self.$refs['select_frame'].innerHTML = self.$refs['select_frame'].innerHTML.replace(/el-icon-loading/g, 'el-icon-error')
                                self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-error')
                                self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-error')
                                self.uploadmsg='文件上传失败';
                            })
                            // .catch(err=>console.log(err))
                    }
                    function addFile(file) {
                        if (file.size > 157286400) {
                            self.uploading=false
                            self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-error')
                            self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-error')
                            self.uploadmsg='文件上传失败, 存在数据文件大小大于150M'
                            console.error('文件上传失败, 文件'+file.fullPath+'大小大于150M')
                            return;
                        }
                        if (!self.uploading) return;
                        let pathArr = file.fullPath.split('/')
                        if (pathArr[1] !== 'session_1'||pathArr[2] !== 'rest_1'&&pathArr[2] !== 'anat_1'){
                            self.uploading=false
                            self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-error')
                            self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-error')
                            self.uploadmsg='文件上传失败, 数据路径不正确'
                            return;
                        }
                        list.push(file)
                        totalcount++
                    }
                    function addFilesFormDirectory(directory, path) {
                        const dirReader = directory.createReader();
                        const readEntries = function readEntries() {
                            return dirReader.readEntries(function(entries) {
                                entries.forEach(function(entry){
                                    if (entry.isFile) {
                                        // 如果是文件
                                        entry.file(function(file){
                                            file.fullPath = path + '/' + file.name;
                                            addFile(file);
                                        });
                                    } else if (entry.isDirectory) {
                                        // 递归处理
                                        addFilesFormDirectory(entry, path + '/' + entry.name);
                                    }
                                });
                            });
                        };
                        return readEntries();
                    }
                    function addFilesItems(items) {
                        for (let i = 0; i < items.length; i++) {
                            let item = items[i];
                            let entry;
                            if (item.webkitGetAsEntry && (entry = item.webkitGetAsEntry())) {
                                if (entry.isFile) {
                                    addFile(item.getAsFile());
                                } else if (entry.isDirectory) {
                                    addFilesFormDirectory(entry, entry.name)
                                }
                            }
                        }
                    }
                    addFilesItems(e.dataTransfer.items)
                    let taskList = []
                    self.taskList.forEach(v=>taskList.push(v.value))
                    // console.log(self.taskList, taskList,self.taskname,taskList.indexOf(self.taskname)>-1)
                    if (taskList.indexOf(self.taskname)>-1) self.$confirm('任务已存在，是否删除原有任务中的数据和结果？', '确认信息', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '是',
                        cancelButtonText: '否'
                    }).then(()=> {
                        if (!self.uploading) return;
                        self.$axios.delete('/MyFile/fmri/' + self.taskname)
                            .then(()=>{
                                self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-loading')
                                self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-loading')
                                self.uploadmsg='文件上传('+uploadcount+'/'+totalcount+')';uploadFile()
                            })
                    }).catch(()=>self.showuploading=false)
                    else setTimeout(function(){
                        if (!self.uploading) return;
                        self.$refs['select_frame'].setAttribute('element-loading-spinner','el-icon-loading')
                        self.$refs['select_frame'].getElementsByClassName('el-loading-spinner')[0].getElementsByTagName('i')[0].setAttribute('class','el-icon-loading')
                        self.uploadmsg='文件上传('+uploadcount+'/'+totalcount+')';uploadFile()
                    }, 1000);
                };
                this.$refs.select_frame.ondragenter = (e) => {
                    e.preventDefault();  //阻止拖入时的浏览器默认行为
                    this.$refs.select_frame.border = '2px dashed red';
                };
                this.$refs.select_frame.ondragover = (e) => {
                    e.preventDefault();    //阻止拖来拖去的浏览器默认行为
                };
            }
        }
    }
</script>

<style lang='stylus' scoped>
    .el-scrollbar__wrap{
        overflow-x: hidden;
    }
    .myCenter {
        display: -moz-box;/*兼容Firefox*/
        display: -webkit-box;/*兼容FSafari、Chrome*/

        -moz-box-align: center;/*兼容Firefox*/
        -webkit-box-align: center;/*兼容FSafari、Chrome */

        -moz-box-pack: center;/*兼容Firefox*/
        -webkit-box-pack: center;/*兼容FSafari、Chrome */
    }
    .myupload {
        width: 300px;
        height: 200px;
        border:3px dashed #8cc5ff;
    }
    .el-step__main {
        white-space: pre !important;
    }
</style>