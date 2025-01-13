import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import '../../Css/MainFont.css';

const Warrper = styled.div`

`;

const Container = styled.div`
    margin-left: 15%;
    margin-right: 15%;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const MainBodyArea = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
`;

const mainDiv = styled.div`
    background-image: linear-gradient(108.70862705949799deg, #303993 26.0234375%, #333a81 26.0234375%, #5865f2 54.01519097222222%, #767dc5 81.54427083333333%);
    /* border: 1px solid #01CD9A; */
    margin-left: 10%;
    margin-right: 10%;
    margin-top: 3%;
    display: flex;
    flex-direction: row;
    border-radius: 20px;
    width: 95%;
`;

const MainOneDiv = styled(mainDiv)`

`;

const MainTwoDiv = styled(mainDiv)`
   background-image: linear-gradient(108.70862705949799deg, #767dc5 18.455729166666668%, #5865f2 45.98480902777778%, #333a81 73.9765625%, #303993 73.9765625%);

`;

const MainThreeDiv = styled(mainDiv)`
   
`;

const ImgSection = styled.div`
    width: 60%;
    margin: 2%;
    border-radius: 20px;
    video{
        width: 100%;
        height: 100%;
        border-radius: 20px;
        
    }
`;

const TextSection = styled.div`
    width: 35%;
    margin: 2%;
    border-radius: 20px;
    overflow-y: auto;
    padding: 8px;
    color: white;
    h2{
        margin-top: 23%;
        margin-bottom : 7%;
        font-weight: 900;
        font-size: 2.25rem;
    }
    p{
        font-size: 1.5rem;
        line-height: 1.5;
    }
`;
function MainHome(props) {

    return (
        <Warrper>
        <Container>
            <MainBodyArea>
                <MainOneDiv>
                    <ImgSection>
                    <video
                        id="a02aafd0-5263-8c7a-e8e6-eddeb8d5f018-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            backgroundImage: 'url("https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/663b271d6f05c8c9e11f8d65_Discord Refresh Sound-MP4-poster-00001.jpg")',
                            objectFit: "cover",
                        }}
                        data-wf-ignore="true"
                        >
                        <source
                            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/663b271d6f05c8c9e11f8d65_Discord Refresh Sound-MP4-transcode.mp4"
                            type="video/mp4"
                            data-wf-ignore="true"
                            />
                        <source
                            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/663b271d6f05c8c9e11f8d65_Discord Refresh Sound-MP4-transcode.webm"
                            type="video/webm"
                            data-wf-ignore="true"
                            />
                        </video>
                    </ImgSection>
                    <TextSection>
                        <h2>그룹 채팅을 더욱 즐겁게 만들어보세요</h2>
                        <p>사용자 정의 이모티콘, 스티커, 사운드보드 효과 등을 사용하여 음성, 비디오 또는 텍스트 채팅에 개성을 더하세요. 아바타와 사용자 정의 상태를 설정하고 나만의 프로필을 작성하여 채팅에 원하는 방식으로 표시하세요.</p>
                    </TextSection>
                </MainOneDiv>
                <MainTwoDiv>
                    <TextSection>
                        <h2>시간이 되면 언제든지 타세요, 전화할 필요 없어요</h2>
                        <p>다른 사람에게 전화를 걸거나 초대하지 않고도 음성 또는 텍스트 채팅에 쉽게 참여하거나 종료할 수 있으므로 게임 세션 전, 중, 후에도 파티 채팅을 계속할 수 있습니다.</p>
                    </TextSection>
                    <ImgSection>
                    <video
                        id="b474df79-d73e-161d-a1d8-bea1315595e1-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            backgroundImage: 'url("https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6638c6b04eff56a99c1e2d7d_Discord_Website_Refresh_Hop-In-poster-00001.jpg")',
                            objectFit: "cover",
                        }}
                        data-wf-ignore="true"
                        >
                        <source
                            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6638c6b04eff56a99c1e2d7d_Discord_Website_Refresh_Hop-In-transcode.mp4"
                            type="video/mp4"
                            data-wf-ignore="true"
                            />
                        <source
                            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/6638c6b04eff56a99c1e2d7d_Discord_Website_Refresh_Hop-In-transcode.webm"
                            type="video/webm"
                            data-wf-ignore="true"
                            />
                    </video>
                    </ImgSection>
                </MainTwoDiv>
                <MainThreeDiv>
                    <ImgSection>
                        <video
                        id="1a8f45d3-1ae5-a039-7ecc-d220d621d366-video"
                        autoPlay
                        loop
                        style={{
                            backgroundImage:
                            'url("https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66446078b3e738a7c1f85e35_Discord_Website_Refresh_Activities_03-poster-00001.jpg")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        muted
                        playsInline
                        >
                        <source
                            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66446078b3e738a7c1f85e35_Discord_Website_Refresh_Activities_03-transcode.mp4"
                            type="video/mp4"
                            />
                        <source
                            src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/66446078b3e738a7c1f85e35_Discord_Website_Refresh_Activities_03-transcode.webm"
                            type="video/webm"
                            />
                        </video>
                    </ImgSection>
                    <TextSection>
                        <h2>누가 쉬러 왔는지 확인해 보세요</h2>
                        <p>누가 주변에 있는지, 게임을 하는지, 그냥 놀고 있는지 확인하세요. 지원되는 게임의 경우, 친구들이 어떤 모드나 캐릭터를 플레이하는지 확인하고 바로 참여할 수 있습니다.</p>
                    </TextSection>
                </MainThreeDiv>
            </MainBodyArea>
        </Container>
    </Warrper>
    );
}

export default MainHome;